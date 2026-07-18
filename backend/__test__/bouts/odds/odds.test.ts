import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    test,
    expect,
    beforeEach,
    afterAll
} from "@jest/globals";
import {
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockEventOne,
    mockCreateDivisionOne,
    mockBoutOne,
    mockCreateOddsOne,
    mockCreateOddsTwo,
    mockUpdateOdds
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de casas de apuestas de una pelea', () => {
    let testBoutId: number;
    let testOddsId: number;

    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        const eventResponse = await setup.apiInstance
            .post(`${settings.basePath}/events`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockEventOne);
        const testEventId = eventResponse.body.data.id;

        const divisionResponse = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionOne);
        const testDivisionId = divisionResponse.body.data.id;

        const redCornerResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterOne);
        const testRedCornerId = redCornerResponse.body.data.id;

        const blueCornerResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterTwo);
        const testBlueCornerId = blueCornerResponse.body.data.id;

        mockBoutOne.event_id = testEventId;
        mockBoutOne.division_id = testDivisionId;
        mockBoutOne.red_corner_id = testRedCornerId;
        mockBoutOne.blue_corner_id = testBlueCornerId;

        const boutResponse = await setup.apiInstance
            .post(`${settings.basePath}/bouts`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockBoutOne);
        testBoutId = boutResponse.body.data.id;

        mockCreateOddsOne.bout_id = testBoutId;
        mockCreateOddsTwo.bout_id = testBoutId;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/odds - Crear una casa de apuestas`, () => {
        test("Deberia crear una casa de apuestas correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Casa de apuesta creada exitosamente');
            expect(response.body.data.provider).toBe(mockCreateOddsOne.provider);
            testOddsId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                bout_id: testBoutId,
                provider: 'DraftKings'
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const invalidData = {
                ...mockCreateOddsOne,
                bout_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea en cuestión');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/odds/bout/:boutId - Obtener casas de apuestas por pelea`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);
            await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsTwo);
        })

        test("Deberia retornar todas las casas de apuestas de una pelea y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/odds/bout/${testBoutId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Casas de apuestas obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/odds/bout/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea en cuestión');
        })
    })

    describe(`GET ${settings.basePath}/odds/provider/:provider - Obtener casas de apuestas por proveedor`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);
            await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsTwo);
        })

        test("Deberia retornar todas las casas de apuestas de un proveedor y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/odds/provider/DraftKings`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Casas de apuestas obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(1);
        })

        test("Deberia retornar un array vacio si no hay casas de apuestas para el proveedor", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/odds/provider/NonExistentProvider`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/odds/:oddsId - Obtener una casa de apuestas por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);
            testOddsId = response.body.data.id;
        })

        test("Deberia retornar una casa de apuestas por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/odds/${testOddsId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Casa de apuesta obtenida exitosamente');
            expect(response.body.data.id).toBe(testOddsId);
        })

        test("Deberia retornar un status 404 si la casa de apuestas no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/odds/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la casa de apuesta en cuestión');
        })
    })

    describe(`PATCH ${settings.basePath}/odds/:oddsId - Actualizar una casa de apuestas`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);
            testOddsId = response.body.data.id;
        })

        test("Deberia actualizar una casa de apuestas correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/odds/${testOddsId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateOdds);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Casa de apuesta actualizada exitosamente');
            expect(response.body.data.id).toBe(testOddsId);
            expect(response.body.data.provider).toBe(mockUpdateOdds.provider);
        })

        test("Deberia retornar un status 404 si la casa de apuestas no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/odds/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateOdds);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la casa de apuesta en cuestión');
        })
    })

    describe(`PATCH ${settings.basePath}/odds/soft/:oddsId - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/odds`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateOddsOne);
            testOddsId = response.body.data.id;
        })

        test("Deberia eliminar una casa de apuestas correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/odds/soft/${testOddsId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Casa de apuesta eliminada exitosamente');
        })

        test("Deberia retornar un status 404 si la casa de apuestas no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/odds/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la casa de apuesta en cuestión');
        })
    })
})

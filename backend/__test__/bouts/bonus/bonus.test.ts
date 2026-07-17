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
    mockCreateBonusFightOfTheNight,
    mockCreateBonusPerformanceOfTheNight,
    mockUpdateBonus
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de bonos de una pelea', () => {
    let testBoutId: number;
    let testRedCornerId: number;
    let testBlueCornerId: number;
    let testBonusId: number;

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
        testRedCornerId = redCornerResponse.body.data.id;

        const blueCornerResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterTwo);
        testBlueCornerId = blueCornerResponse.body.data.id;

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

        mockCreateBonusFightOfTheNight.bout_id = testBoutId;
        mockCreateBonusFightOfTheNight.fighter_id = testRedCornerId;
        mockCreateBonusPerformanceOfTheNight.bout_id = testBoutId;
        mockCreateBonusPerformanceOfTheNight.fighter_id = testBlueCornerId;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/bonuses - Crear un bono`, () => {
        test("Deberia crear un bono correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Bono agregado exitosamente');
            expect(response.body.data.bonus_type).toBe(mockCreateBonusFightOfTheNight.bonus_type);
            testBonusId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                bout_id: testBoutId
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const invalidData = {
                ...mockCreateBonusFightOfTheNight,
                bout_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                ...mockCreateBonusFightOfTheNight,
                fighter_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/bonuses - Obtener todos los bonos`, () => {
        test("Deberia retornar un array vacio si no hay bonos y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Bonos obtenidos exitosamente');
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar todos los bonos y un status 200", async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);
            await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusPerformanceOfTheNight);

            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Bonos obtenidos exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        })

        test("Deberia retornar un status 400 si el parametro page no es un numero", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses?page=abc`)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El page debe ser un número');
        })
    })

    describe(`GET ${settings.basePath}/bonuses/fighter/:fighterId - Obtener bonos por luchador`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);
        })

        test("Deberia retornar los bonos de un luchador y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses/fighter/${testRedCornerId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Bonos obtenidos exitosamente');
            expect(response.body.data.length).toBe(1);
        })

        test("Deberia retornar un array vacio si el luchador no tiene bonos", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses/fighter/${testBlueCornerId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses/fighter/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador');
        })
    })

    describe(`GET ${settings.basePath}/bonuses/:bonusId - Obtener un bono por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);
            testBonusId = response.body.data.id;
        })

        test("Deberia retornar un bono por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses/${testBonusId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Bono obtenido exitosamente');
            expect(response.body.data.id).toBe(testBonusId);
        })

        test("Deberia retornar un status 404 si el bono no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bonuses/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el bono');
        })
    })

    describe(`PATCH ${settings.basePath}/bonuses/:bonusId - Actualizar un bono`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);
            testBonusId = response.body.data.id;
        })

        test("Deberia actualizar un bono correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bonuses/${testBonusId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateBonus);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Bono actualizado exitosamente');
            expect(response.body.data.id).toBe(testBonusId);
            expect(response.body.data.bonus_type).toBe(mockUpdateBonus.bonus_type);
        })

        test("Deberia retornar un status 404 si el bono no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bonuses/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateBonus);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el bono');
        })
    })

    describe(`PATCH ${settings.basePath}/bonuses/soft/:bonusId - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bonuses`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateBonusFightOfTheNight);
            testBonusId = response.body.data.id;
        })

        test("Deberia eliminar un bono correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bonuses/soft/${testBonusId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Bono eliminado exitosamente');
        })

        test("Deberia retornar un status 404 si el bono no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bonuses/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el bono');
        })
    })
})

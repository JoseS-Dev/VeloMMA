import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    test,
    beforeEach,
    afterAll,
    expect
} from "@jest/globals";
import {
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockEventOne,
    mockCreateDivisionOne,
    mockBoutOne,
    mockCreateDataOne,
    mockCreateDataTwo,
    mockUpdateData
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de jueces de una pelea', () => {
    let testBoutId: number;
    let testJudgeId: number;

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

        mockCreateDataOne.bout_id = testBoutId;
        mockCreateDataTwo.bout_id = testBoutId;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/judges - Crear un juez`, () => {
        test("Deberia crear un juez correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataOne);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Juez creado correctamente');
            expect(response.body.data.judge_name).toBe(mockCreateDataOne.judge_name);
            testJudgeId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                bout_id: testBoutId
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const invalidData = {
                ...mockCreateDataOne,
                bout_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicha pelea');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataOne);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/judges/bout/:boutId - Obtener jueces por pelea`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataOne);
            await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataTwo);
        })

        test("Deberia retornar todos los jueces de una pelea y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/judges/bout/${testBoutId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Juez obtenido correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/judges/bout/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicha pelea');
        })

        test("Deberia retornar un array vacio si no hay jueces para la pelea", async () => {
            await setup.clearDatabase();
            await setup.clearDatabaseDeleteMany();

            const response = await setup.apiInstance
                .get(`${settings.basePath}/judges/bout/${testBoutId}`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicha pelea');
        })
    })

    describe(`GET ${settings.basePath}/judges/:id - Obtener un juez por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataOne);
            testJudgeId = response.body.data.id;
        })

        test("Deberia retornar un juez por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/judges/${testJudgeId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Juez obtenido correctamente');
            expect(response.body.data.id).toBe(testJudgeId);
        })

        test("Deberia retornar un status 404 si el juez no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/judges/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho juez');
        })
    })

    describe(`PATCH ${settings.basePath}/judges/:id - Actualizar un juez`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataOne);
            testJudgeId = response.body.data.id;
        })

        test("Deberia actualizar un juez correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/judges/${testJudgeId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Juez actualizado correctamente');
            expect(response.body.data.id).toBe(testJudgeId);
            expect(response.body.data.judge_name).toBe(mockUpdateData.judge_name);
        })

        test("Deberia retornar un status 404 si el juez no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/judges/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho juez');
        })
    })

    describe(`PATCH ${settings.basePath}/judges/soft/:id - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/judges`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDataOne);
            testJudgeId = response.body.data.id;
        })

        test("Deberia eliminar un juez correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/judges/soft/${testJudgeId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Juez eliminado correctamente');
        })

        test("Deberia retornar un status 404 si el juez no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/judges/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho juez');
        })
    })
})

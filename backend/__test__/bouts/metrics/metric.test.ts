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
    mockCreateMetricsRoundOne,
    mockCreateMetricsRoundTwo,
    mockUpdateMetrics
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de metricas de una pelea', () => {
    let testBoutId: number;
    let testRedCornerId: number;
    let testBlueCornerId: number;
    let testMetricId: number;

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

        mockCreateMetricsRoundOne.bout_id = testBoutId;
        mockCreateMetricsRoundOne.fighter_id = testRedCornerId;
        mockCreateMetricsRoundTwo.bout_id = testBoutId;
        mockCreateMetricsRoundTwo.fighter_id = testRedCornerId;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/metrics - Crear una metrica`, () => {
        test("Deberia crear una metrica correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Métrica agregada exitosamente');
            expect(response.body.data.round).toBe(mockCreateMetricsRoundOne.round);
            testMetricId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                bout_id: testBoutId
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const invalidData = {
                ...mockCreateMetricsRoundOne,
                bout_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                ...mockCreateMetricsRoundOne,
                fighter_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/metrics/bout/:BoutId - Obtener metricas por pelea`, () => {
        test("Deberia retornar un array vacio si no hay metricas para la pelea y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/${testBoutId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Métricas obtenidas exitosamente');
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar todas las metricas de una pelea y un status 200", async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundTwo);

            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/${testBoutId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Métricas obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })

        test("Deberia retornar un status 400 si el parametro page no es un numero", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/${testBoutId}?page=abc`)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El page debe ser un número');
        })
    })

    describe(`GET ${settings.basePath}/metrics/bout/:BoutId/fighter/:fighterId/round/:round - Obtener metricas por luchador y round`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundTwo);
        })

        test("Deberia retornar las metricas de un luchador en un round especifico y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/${testBoutId}/fighter/${testRedCornerId}/round/1`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Métricas obtenidas exitosamente');
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].round).toBe(1);
        })

        test("Deberia retornar un array vacio si no hay metricas para el luchador en ese round", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/${testBoutId}/fighter/${testBlueCornerId}/round/1`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/9999/fighter/${testRedCornerId}/round/1`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/bout/${testBoutId}/fighter/9999/round/1`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador');
        })
    })

    describe(`GET ${settings.basePath}/metrics/:MetricId - Obtener una metrica por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);
            testMetricId = response.body.data.id;
        })

        test("Deberia retornar una metrica por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/${testMetricId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Métrica obtenida exitosamente');
            expect(response.body.data.id).toBe(testMetricId);
        })

        test("Deberia retornar un status 404 si la metrica no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/metrics/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la métrica');
        })
    })

    describe(`PATCH ${settings.basePath}/metrics/:MetricId - Actualizar una metrica`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);
            testMetricId = response.body.data.id;
        })

        test("Deberia actualizar una metrica correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/metrics/${testMetricId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateMetrics);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Métrica actualizada exitosamente');
            expect(response.body.data.id).toBe(testMetricId);
            expect(response.body.data.sig_strikes_landed).toBe(mockUpdateMetrics.sig_strikes_landed);
        })

        test("Deberia retornar un status 404 si la metrica no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/metrics/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateMetrics);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la métrica');
        })
    })

    describe(`PATCH ${settings.basePath}/metrics/soft/:MetricId - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);
            testMetricId = response.body.data.id;
        })

        test("Deberia eliminar una metrica correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/metrics/soft/${testMetricId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Métrica eliminada exitosamente');
        })

        test("Deberia retornar un status 404 si la metrica no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/metrics/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la métrica');
        })
    })
})

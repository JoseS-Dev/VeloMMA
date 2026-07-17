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
    mockOpponentMetricsRoundOne,
    mockOpponentMetricsRoundTwo
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de estadisticas de carrera de un luchador', () => {
    let testFighterId: number;
    let testOpponentId: number;
    let testBoutId: number;

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

        const fighterOneResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterOne);
        testFighterId = fighterOneResponse.body.data.id;

        const fighterTwoResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterTwo);
        testOpponentId = fighterTwoResponse.body.data.id;

        mockBoutOne.event_id = testEventId;
        mockBoutOne.division_id = testDivisionId;
        mockBoutOne.red_corner_id = testFighterId;
        mockBoutOne.blue_corner_id = testOpponentId;
        mockBoutOne.rounded_ended = 2;
        mockBoutOne.time_ended = 300;

        const boutResponse = await setup.apiInstance
            .post(`${settings.basePath}/bouts`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockBoutOne);
        testBoutId = boutResponse.body.data.id;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`PATCH ${settings.basePath}/stats/:fighterId - Calcular estadisticas de carrera`, () => {
        beforeEach(async () => {
            mockCreateMetricsRoundOne.bout_id = testBoutId;
            mockCreateMetricsRoundOne.fighter_id = testFighterId;
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundOne);

            mockCreateMetricsRoundTwo.bout_id = testBoutId;
            mockCreateMetricsRoundTwo.fighter_id = testFighterId;
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateMetricsRoundTwo);

            mockOpponentMetricsRoundOne.bout_id = testBoutId;
            mockOpponentMetricsRoundOne.fighter_id = testOpponentId;
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockOpponentMetricsRoundOne);

            mockOpponentMetricsRoundTwo.bout_id = testBoutId;
            mockOpponentMetricsRoundTwo.fighter_id = testOpponentId;
            await setup.apiInstance
                .post(`${settings.basePath}/metrics`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockOpponentMetricsRoundTwo);
        })

        test("Deberia calcular y crear estadisticas correctamente retornando status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stats/${testFighterId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Metricas actualizadas existosamente');
            expect(response.body.data.fighter_id).toBe(testFighterId);
            expect(response.body.data.sig_strikes_accuracy).toBe(50.94);
            expect(response.body.data.takedown_accuracy).toBe(60.00);
            expect(response.body.data.takedown_defense).toBe(60.00);
            expect(response.body.data.sig_strikes_absorbed_pm).toBe(1.20);
            expect(response.body.data.average_fight_time).toBe(600.00);
        })

        test("Deberia retornar las estadisticas existentes si se llama dos veces (idempotente)", async () => {
            const firstResponse = await setup.apiInstance
                .patch(`${settings.basePath}/stats/${testFighterId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});

            const secondResponse = await setup.apiInstance
                .patch(`${settings.basePath}/stats/${testFighterId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});

            expect(secondResponse.status).toBe(200);
            expect(secondResponse.body.data.sig_strikes_accuracy).toBe(50.94);
            expect(secondResponse.body.data.created_at).toBe(firstResponse.body.data.created_at);
        })

        test("Deberia retornar un status 400 si el fighterId no es un numero", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stats/abc`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El parámetro "fighterId" es inválido');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stats/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stats/${testFighterId}`)
                .set('Content-Type', 'application/json')
                .send({});

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/stats/:fighterId - Obtener estadisticas de carrera`, () => {
        test("Deberia retornar las estadisticas de un luchador y un status 200", async () => {
            await setup.apiInstance
                .patch(`${settings.basePath}/stats/${testFighterId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});

            const response = await setup.apiInstance
                .get(`${settings.basePath}/stats/${testFighterId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Metricas obtenidas existosamente');
            expect(response.body.data.fighter_id).toBe(testFighterId);
        })

        test("Deberia retornar un status 400 si el fighterId no es un numero", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stats/abc`)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El parámetro "fighterId" es inválido');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stats/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })

        test("Deberia retornar un status 404 si no existen estadisticas para el luchador", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stats/${testFighterId}`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existen estadisticas para el luchador en cuestión');
        })
    })
})

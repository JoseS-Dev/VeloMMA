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
    mockCreateWeighInOne,
    mockCreateWeighInTwo,
    mockUpdateWeighIn
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de pesajes oficiales de una pelea', () => {
    let testBoutId: number;
    let testRedCornerId: number;
    let testBlueCornerId: number;
    let testWeighInId: number;

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

        mockCreateWeighInOne.bout_id = testBoutId;
        mockCreateWeighInOne.fighter_id = testRedCornerId;
        mockCreateWeighInTwo.bout_id = testBoutId;
        mockCreateWeighInTwo.fighter_id = testBlueCornerId;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/weighIns - Crear un pesaje oficial`, () => {
        test("Deberia crear un pesaje oficial correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial creado correctamente');
            expect(response.body.data.weight_recorded).toBe(mockCreateWeighInOne.weight_recorded);
            testWeighInId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                bout_id: testBoutId
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const invalidData = {
                ...mockCreateWeighInOne,
                bout_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicha pelea');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                ...mockCreateWeighInOne,
                fighter_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho luchador');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/weighIns - Obtener todos los pesajes oficiales`, () => {
        test("Deberia retornar un array vacio si no hay pesajes oficiales y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial obtenido correctamente');
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar todos los pesajes oficiales y un status 200", async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);
            await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInTwo);

            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial obtenido correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        })

        test("Deberia retornar un status 400 si el parametro cursor no es un numero entero", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns?cursor=abc`)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El parámetro cursor debe ser un número entero positivo');
        })
    })

    describe(`GET ${settings.basePath}/weighIns/bout/:boutId - Obtener pesajes oficiales por pelea`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);
            await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInTwo);
        })

        test("Deberia retornar todos los pesajes oficiales de una pelea y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns/bout/${testBoutId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial obtenido correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns/bout/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicha pelea');
        })
    })

    describe(`GET ${settings.basePath}/weighIns/:id - Obtener un pesaje oficial por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);
            testWeighInId = response.body.data.id;
        })

        test("Deberia retornar un pesaje oficial por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns/${testWeighInId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial obtenido correctamente');
            expect(response.body.data.id).toBe(testWeighInId);
        })

        test("Deberia retornar un status 404 si el pesaje oficial no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weighIns/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho pesaje');
        })
    })

    describe(`PATCH ${settings.basePath}/weighIns/:id - Actualizar un pesaje oficial`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);
            testWeighInId = response.body.data.id;
        })

        test("Deberia actualizar un pesaje oficial correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weighIns/${testWeighInId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateWeighIn);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial actualizado correctamente');
            expect(response.body.data.id).toBe(testWeighInId);
            expect(response.body.data.weight_recorded).toBe(mockUpdateWeighIn.weight_recorded);
        })

        test("Deberia retornar un status 404 si el pesaje oficial no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weighIns/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateWeighIn);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho pesaje');
        })
    })

    describe(`PATCH ${settings.basePath}/weighIns/soft/:id - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weighIns`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateWeighInOne);
            testWeighInId = response.body.data.id;
        })

        test("Deberia eliminar un pesaje oficial correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weighIns/soft/${testWeighInId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pesaje oficial eliminado correctamente');
        })

        test("Deberia retornar un status 404 si el pesaje oficial no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weighIns/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe dicho pesaje');
        })
    })
})

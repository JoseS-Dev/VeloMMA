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
    mockCreateTeamOne,
    mockCreateTeamTwo,
    mockEventOne,
    mockCreateDivisionOne,
    mockBoutOne,
    mockCreateTrainingCamp,
    mockUpdateCamp
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe('Modulo de campamentos de entrenamiento de una pelea', () => {
    let testBoutId: number;
    let testRedCornerId: number;
    let testBlueCornerId: number;
    let testTeamOneId: number;
    let testTeamTwoId: number;
    let testCampId: number;

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

        const teamOneResponse = await setup.apiInstance
            .post(`${settings.basePath}/teams`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateTeamOne);
        testTeamOneId = teamOneResponse.body.data.id;

        const teamTwoResponse = await setup.apiInstance
            .post(`${settings.basePath}/teams`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateTeamTwo);
        testTeamTwoId = teamTwoResponse.body.data.id;

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

        mockCreateTrainingCamp.bout_id = testBoutId;
        mockCreateTrainingCamp.team_id = testTeamOneId;
        mockCreateTrainingCamp.fighter_id = testRedCornerId;

        mockUpdateCamp.team_id = testTeamTwoId;
    })

    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/camps - Crear un campamento de entrenamiento`, () => {
        test("Deberia crear un campamento correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Campamento creado exitosamente');
            expect(response.body.data.fighter_id).toBe(testRedCornerId);
            testCampId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                bout_id: testBoutId
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const invalidData = {
                ...mockCreateTrainingCamp,
                bout_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea en cuestión');
        })

        test("Deberia retornar un status 404 si el equipo no existe", async () => {
            const invalidData = {
                ...mockCreateTrainingCamp,
                team_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el equipo en cuestión');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                ...mockCreateTrainingCamp,
                fighter_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador en cuestión');
        })

        test("Deberia retornar un status 409 si el campamento ya existe", async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);

            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'El campamento ya existe');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/camps/fighter/:fighterId - Obtener campamentos por luchador`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);
        })

        test("Deberia retornar los campamentos de un luchador y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/fighter/${testRedCornerId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Campamentos obtenidos exitosamente');
            expect(response.body.data.length).toBe(1);
        })

        test("Deberia retornar un array vacio si el luchador no tiene campamentos", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/fighter/${testBlueCornerId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/fighter/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador en cuestión');
        })

        test("Deberia retornar un status 400 si el parametro cursor no es un numero", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/fighter/${testRedCornerId}?cursor=abc`)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El parámetro cursor debe ser un número entero positivo');
        })
    })

    describe(`GET ${settings.basePath}/camps/team/:teamId - Obtener campamentos por equipo`, () => {
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);
        })

        test("Deberia retornar los campamentos de un equipo y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/team/${testTeamOneId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Campamentos obtenidos exitosamente');
            expect(response.body.data.length).toBe(1);
        })

        test("Deberia retornar un array vacio si el equipo no tiene campamentos", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/team/${testTeamTwoId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        })

        test("Deberia retornar un status 404 si el equipo no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/team/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el equipo en cuestión');
        })

        test("Deberia retornar un status 400 si el parametro limit no es un numero", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/team/${testTeamOneId}?limit=abc`)

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El parámetro limit debe ser un número entero positivo');
        })
    })

    describe(`GET ${settings.basePath}/camps/:campId - Obtener un campamento por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);
            testCampId = response.body.data.id;
        })

        test("Deberia retornar un campamento por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/${testCampId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Campamento obtenido exitosamente');
            expect(response.body.data.id).toBe(testCampId);
        })

        test("Deberia retornar un status 404 si el campamento no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/camps/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el campamento en cuestión');
        })
    })

    describe(`PATCH ${settings.basePath}/camps/:campId - Actualizar un campamento`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);
            testCampId = response.body.data.id;
        })

        test("Deberia actualizar un campamento correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/camps/${testCampId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateCamp);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Campamento actualizado exitosamente');
            expect(response.body.data.id).toBe(testCampId);
            expect(response.body.data.team_id).toBe(testTeamTwoId);
        })

        test("Deberia retornar un status 404 si el campamento no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/camps/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateCamp);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el campamento en cuestión');
        })
    })

    describe(`PATCH ${settings.basePath}/camps/soft/:campId - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/camps`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTrainingCamp);
            testCampId = response.body.data.id;
        })

        test("Deberia eliminar un campamento correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/camps/soft/${testCampId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Campamento eliminado exitosamente');
        })

        test("Deberia retornar un status 404 si el campamento no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/camps/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el campamento en cuestión');
        })
    })
})

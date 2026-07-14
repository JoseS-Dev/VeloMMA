import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    beforeEach,
    afterEach,
    expect,
    test,
    beforeAll,
} from "@jest/globals";
import { settings } from "../../../config/settings.js";
import { 
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockCreateDivisionOne,
    mockCreateDivisionTwo,
    mockCreateTitleOne,
    updateTitleData 
} from "../../../mocks/index.js";

const setup = new TestBase();

// Definición de los tests para la entidad "Titles"
describe("Modulo de los Titulos de luchadores", () => {
    let testFighterId: number;
    let testFighterId2: number;
    let testDivisionId: number;
    let testDivisionId2: number;
    let testTitleId: number;

    // Antes de cada test, se limpia la base de datos y se crean los datos necesarios para los tests
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // Se crea el primer luchador de prueba
        const fighterResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterOne);
        testFighterId = fighterResponse.body.data.id;

        // Se crea el segundo luchador de prueba
        const fighterResponse2 = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterTwo);
        testFighterId2 = fighterResponse2.body.data.id;

        // Se crea la primera división de prueba
        const divisionResponse = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionOne);
        testDivisionId = divisionResponse.body.data.id;

        // Se crea la segunda división de prueba
        const divisionResponse2 = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionTwo);
        testDivisionId2 = divisionResponse2.body.data.id;

        // Actaulizamos los datos de los titulos
        mockCreateTitleOne.fighter_id = testFighterId;
        mockCreateTitleOne.division_id = testDivisionId;
    });

    // Después de cada test, se desconecta de la base de datos
    afterEach(async () => {
        await setup.disconnect();
    });

    describe(`POST ${settings.basePath}/titles - Crear un nuevo titulo`, () => {
        test("Deberia crear un titulo para un luchador y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "Titulo creado correctamente");
            testTitleId = response.body.data.id;
        });

        test("Deberia retornar un status 400 si los datos enviados no son validos", async () => {
            const invalidTitleData = {
                fighter_id: "invalid_id",
            };
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidTitleData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Error de validación");
            expect(response.body).toHaveProperty("error");
        });

        test("Deberia retornar un status 404 si no existe el luchador", async () => {
            const invalidData = {
                fighter_id: 9999,
                division_id: testDivisionId,
                title_type: "Interino",
                won_date: "2023-01-01T00:00:00.000Z"
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "El luchador no existe");
        })

        test("Deberia retornar un status 404 si no existe la division", async () => {
            const invalidData = {
                fighter_id: testFighterId,
                division_id: 9999,
                title_type: "Interino",
                won_date: "2023-01-01T00:00:00.000Z"
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "La división no existe");
        });

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);
            
            expect(response.status).toBe(401);
        })
    });

    describe(`GET ${settings.basePath}/titles/fighter/:fighterId - Obtener todos los titulos`, () => {
        beforeEach(async () => {
            // Crear múltiples títulos
            await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);

            await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateTitleOne,
                    fighter_id: testFighterId2,
                    title_type: 'Interino',
                    won_date: '2023-06-01T00:00:00.000Z'
                });

            await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateTitleOne,
                    division_id: testDivisionId2,
                    title_type: 'Undisputed',
                    won_date: '2023-03-01T00:00:00.000Z'
                });
        });

        test("Deberia retornar un status 200 y un listado de titulos para un luchador", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/fighter/${testFighterId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Titulos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test("Deberia retornar un status 404 si no existe el luchador", async () => {
            const nonExistentFighterId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/fighter/${nonExistentFighterId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        });

        test("Deberia retornar un array vacio si no hay titulos", async () => {
            // Se crea un luchador y una división sin titulos
            await setup.clearDatabase();
            const fighterResponse = await setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateFighterOne);
            testFighterId = fighterResponse.body.data.id;

            const divisionResponse = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            testDivisionId = divisionResponse.body.data.id;

            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/fighter/${testFighterId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    });

    describe(`GET ${settings.basePath}/titles/division/:divisionId - Obtener todos los titulos de una división`, () => {
        beforeEach(async () => {
            // Crear múltiples títulos
            await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);
            
            await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateTitleOne,
                    fighter_id: testFighterId2,
                    title_type: 'Interino',
                    won_date: '2023-06-01T00:00:00.000Z'
                });
            
            await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateTitleOne,
                    division_id: testDivisionId2,
                    title_type: 'Undisputed',
                    won_date: '2023-03-01T00:00:00.000Z'
                });
        })

        test("Deberia retornar un status 200 y un listado de titulos para una división", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/division/${testDivisionId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Titulos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test("Deberia retornar un status 404 si no existe la división", async () => {
            const nonExistentDivisionId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/division/${nonExistentDivisionId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'La división no existe');
        });

        test("Deberia retornar un array vacio si no hay titulos en la división", async () => {
            // Se crea un luchador y una división sin titulos
            await setup.clearDatabase();
            const fighterResponse = await setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateFighterOne);
            testFighterId = fighterResponse.body.data.id;

            const divisionResponse = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            testDivisionId = divisionResponse.body.data.id;

            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/division/${testDivisionId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/titles/:titleId - Obtener un titulo por su ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);
            testTitleId = response.body.data.id;
        });

        test("Deberia retornar un status 200 y el titulo correspondiente al ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/${testTitleId}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Titulo obtenido correctamente');
        });

        test("Deberia retornar un status 404 si no existe el titulo", async () => {
            const nonExistentTitleId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/titles/${nonExistentTitleId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El titulo no existe');
        });
    })

    describe(`PATCH ${settings.basePath}/titles/:titleId - Actualizar un titulo por su ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);
            testTitleId = response.body.data.id;
        });

        test("Deberia retornar un status 200 y el titulo actualizado", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/titles/${testTitleId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateTitleData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Titulo actualizado correctamente');
        });

        test("Deberia retornar un status 404 si no existe el titulo", async () => {
            const nonExistentTitleId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/titles/${nonExistentTitleId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateTitleData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El titulo no existe');
        });
    })

    describe(`PATCH ${settings.basePath}/titles/soft/:titleId - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/titles`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTitleOne);
            testTitleId = response.body.data.id;
        });

        test("Deberia retornar un status 200 y el titulo eliminado", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/titles/soft/${testTitleId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Titulo eliminado correctamente');

            // Se verifica que el titulo ya no existe en la base de datos
            const getResponse = await setup.apiInstance
                .get(`${settings.basePath}/titles/${testTitleId}`);
            
            expect(getResponse.status).toBe(404);
        });

        test("Deberia retornar un status 404 si no existe el titulo", async () => {
            const nonExistentTitleId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/titles/soft/${nonExistentTitleId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El titulo no existe');
        })
    })
})
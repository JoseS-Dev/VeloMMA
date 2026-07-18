import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    test,
    beforeEach,
    afterAll,
    beforeAll,
    expect
} from '@jest/globals';
import { settings } from "../../../config/settings.js";
import {
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockCreateDivisionOne,
    mockCreateDivisionTwo,
    mockCreateRanking
} from "../../../mocks/__test__/index.js"

const setup = new TestBase();

// Definiciones del test del modulo de ranking de los luchadores
describe('Modulo de Rankings de los luchadores', () => {
    let testFighterId: number;
    let testFighterIdTwo: number;
    let testDivisionId: number;
    let testDivisionIdTwo: number;
    let testRankingId: number;

    // Antes de cada test, se limpia la base de datos y se crea los datos necesarios
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // creamos dos luchadores de prueba
        const fighterOne = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterOne);
        testFighterId = fighterOne.body.data.id;

        const fighterTwo = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterTwo);
        testFighterIdTwo = fighterTwo.body.data.id;

        // creamos dos divisiones de prueba
        const divisionOne = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionOne);
        testDivisionId = divisionOne.body.data.id;

        const divisionTwo = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionTwo);
        testDivisionIdTwo = divisionTwo.body.data.id;

        // Actualizamos los datos de prueba para el ranking con los ids de los luchadores y divisiones creados
        mockCreateRanking.fighter_id = testFighterId;
        mockCreateRanking.division_id = testDivisionId;
    });

    // Después de todos los tests, se cierra la conexión de la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Definición de los test para el modulo de rankings de los luchadores
    describe(`POST ${settings.basePath}/rankings - Crear una nueva clasificación`, () => {
        test("Deberia crear una nueva clasificación para un luchador y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Clasificación agregada exitosamente');
            testRankingId = response.body.data.id;
        });

        test("Deberia retornar un status 400 si los datos de la clasificación son inválidos", async () => {
            const invalidRankingData = {
                ...mockCreateRanking,
                rank: -1
            };
            const response = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidRankingData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        });

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidFighterRankingData = {
                ...mockCreateRanking,
                fighter_id: 9999
            };
            const response = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidFighterRankingData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador');
        });

        test("Deberia retornar un status 404 si la división no existe", async () => {
            const invalidDivisionRankingData = {
                ...mockCreateRanking,
                division_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidDivisionRankingData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la división');
        });

        test("Deberia retornar un status 409 si el luchador ya pertenece a la clasificación", async () => {
            // Primero creamos la clasificación
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            
            // Luego intentamos crear la misma clasificación nuevamente
            const response = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'El luchador ya pertenece a dicha clasificación');
        })

        test("Deberia retornar un status 401 sin API key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            
            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/rankings - Obtener todas las clasificaciones`, () => {
        beforeEach(async () => {
            // Creamos múltiples rankings
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateRanking,
                    fighter_id: testFighterIdTwo,
                    division_id: testDivisionIdTwo,
                    rank: 2
                });
            
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateRanking,
                    fighter_id: testFighterId,
                    division_id: testDivisionIdTwo,
                    rank: 3
                });
        })

        test("Deberia retornar todas las clasificaciones y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Clasificaciones obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.meta).toHaveProperty('total', 3);
        })

        test("Deberia retornar un array vacio si no hay clasificaciones y retornar un status 200", async () => {
            await setup.clearDatabase();
            await setup.clearDatabaseDeleteMany();

            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings`)
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        });
    });

    describe(`GET ${settings.basePath}/rankings/division/:DivisionId - Obtener rankings por división`, () => {
        beforeEach(async () => {
            // Creamos múltiples rankings
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateRanking,
                    fighter_id: testFighterIdTwo,
                    division_id: testDivisionIdTwo,
                    rank: 2
                });
            
            await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateRanking,
                    fighter_id: testFighterId,
                    division_id: testDivisionIdTwo,
                    rank: 3
                });
        });

        test("Deberia retornar todas las clasificaciones de una división especifica y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings/division/${testDivisionId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(Array.isArray(response.body.data)).toBe(true);

            // verificamos que todos son de la división correcta
            response.body.data.forEach((ranking: any) => {
                expect(ranking).toHaveProperty('division_id', testDivisionId);
            });
        });

        test("Deberia retornar un status 404 si la división no existe", async () => {
            const nonExistentDivisionId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings/division/${nonExistentDivisionId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la división');
        })

        test("Deberia retornar un array vacio si la división no tiene clasificaciones", async () => {
            // Creamos una nueva división sin clasificaciones
            const newDivisionResponse = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    name_division: 'Nueva División',
                    weight_class: 'Peso Ligero',
                    gender: 'Masculino'
                });
            const newDivisionId = newDivisionResponse.body.data.id;

            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings/division/${newDivisionId}`);
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/rankings/:RankingId - Obtener una clasificación por su ID`, () => {
        beforeEach(async () => {
            // Creamos un ranking de prueba
            const rankingResponse = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            testRankingId = rankingResponse.body.data.id;
        });

        test("Deberia retornar una clasificación por su ID y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings/${testRankingId}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Clasificación obtenida exitosamente');
        });

        test("Deberia retornar un status 404 si la clasificación no existe", async () => {
            const nonExistentRankingId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/rankings/${nonExistentRankingId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la clasificación');
        })
    });

    describe(`PATCH ${settings.basePath}/rankings/:RankingId - Actualizar una clasificación por su ID`, () => {
        beforeEach(async () => {
            // Creamos un ranking de prueba
            const rankingResponse = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            testRankingId = rankingResponse.body.data.id;
        });

        test("Deberia actualizar una clasificación por su ID y retornar un status 200", async () => {
            const updatedRankingData = {
                rank: 5
            };
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/rankings/${testRankingId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedRankingData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Clasificación actualizada exitosamente');
        });

        test("Deberia retornar un status 400 si los datos de actualización son invalidos", async () => {
            const invalidUpdatedRankingData = {
                rank: -1
            };
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/rankings/${testRankingId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidUpdatedRankingData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 404 si la clasificación no existe", async () => {
            const nonExistentRankingId = 9999;
            const updatedRankingData = {
                rank: 5
            };
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/rankings/${nonExistentRankingId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedRankingData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la clasificación');
        })
    })

    describe(`PATCH ${settings.basePath}/rankings/soft/:RankingId - Eliminar una clasificación por su ID`, () => {
        beforeEach(async () => {
            // Creamos un ranking de prueba
            const rankingResponse = await setup.apiInstance
                .post(`${settings.basePath}/rankings`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateRanking);
            testRankingId = rankingResponse.body.data.id;
        });

        test("Deberia eliminar una clasificación por su ID y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/rankings/soft/${testRankingId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Clasificación eliminada exitosamente');

        });

        test("Deberia retornar un status 404 si la clasificación no existe", async () => {
            const nonExistentRankingId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/rankings/soft/${nonExistentRankingId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la clasificación');
        })
    })

})
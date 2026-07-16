import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    expect,
    beforeEach,
    afterAll,
    test
} from '@jest/globals';
import { 
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockCreateDivisionOne,
    mockCreateDivisionTwo,
    mockWeightDataOne,
    mockWeightDataTwo,
    updateWeightData 
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

// Definición de los test para el modulo de las relaciones de la divisiones con los luchadores
describe('Modulo de relaciones de las divisiones con los luchadores', () => {
    let testFighterOneId: number;
    let testFighterTwoId: number;
    let testDivisionOneId: number;
    let testDivisionTwoId: number;
    let testWeightId: number;
    let testWeightIdTwo: number;

    // Antes de cada test, se limpia la base de datos y se crean los datos necesarios para las pruebas
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // Se crea los dos luchadores de prueba
        const [fighterOne, fighterTwo] = await Promise.all([
            setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateFighterOne),
            setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateFighterTwo)
        ]);
        testFighterOneId = fighterOne.body.data.id;
        testFighterTwoId = fighterTwo.body.data.id;

        // Se crea las dos divisiones de prueba
        const [divisionOne, divisionTwo] = await Promise.all([
            setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne),
            setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionTwo)
        ]);
        testDivisionOneId = divisionOne.body.data.id;
        testDivisionTwoId = divisionTwo.body.data.id;

        // Se actauliza los datos de prueba con los ids generados
        mockWeightDataOne.fighter_id = testFighterOneId;
        mockWeightDataOne.division_id = testDivisionOneId;
        mockWeightDataTwo.fighter_id = testFighterTwoId;
        mockWeightDataTwo.division_id = testDivisionTwoId;
    });

    // Después de realizar todos los test, se desconecta de la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Test
    describe(`POST ${settings.basePath}/weights - Crear una relación luchador-division`, () => {
        test("Deberia crear una relación entre un luchador y una división y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataOne);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'Peso oficial creado correctamente');
            testWeightId = response.body.data.id;
        });

        test("Deberia retornar un status 400 si se intenta crear una relación con datos invalidos", async () => {
            const invalidData = {
                fighter_id: "invalid_id",
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                ...mockWeightDataOne,
                fighter_id: 9999,
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el luchador');
        });

        test("Deberia retornar un status 404 si la división no existe", async () => {
            const invalidData = {
                ...mockWeightDataOne,
                division_id: 9999,
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró la división');
        })

        test("Deberia retornar un status 409 si se intenta crear una relación ya existente", async () => {
            // Creamos una primera relación 
            await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataTwo);
            
            // Intentamos crear la misma relación nuevamente
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataTwo);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'El luchador ya pertence a dicho peso');
        })

        test("Deberia retornar un status 401 si no se le proporciona la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataOne);
            
            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/weights/fighter/:fighterId - Obtener todas las divisiones de un luchador`, () => {
        beforeEach(async() => {
            // Creamos multiples relaciones de prueba para el luchador 1
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataOne);
            
            testWeightId = response.body.data.id;

            const responseTwo = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    fighter_id: testFighterOneId,
                    division_id: testDivisionTwoId,
                    is_current: true
                });
            testWeightIdTwo = responseTwo.body.data.id;
        });

        test("Deberia retornar un status 200 y todas las divisiones de un luchador", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weights/fighter/${testFighterOneId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Pesos oficiales obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);

            // Verificamos que todas son del luchador en cuestión
            response.body.data.forEach((weight: any) => {
                expect(weight.fighter_id).toBe(testFighterOneId);
            });
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weights/fighter/9999`)
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })

        test("Deberia retornar un array vacio si el luchador no tiene divisiones", async () => {
            // Se crea un luchador sin divisiones
            const newFighterResponse = await setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateFighterOne,
                    first_name: 'Nuevo',
                    last_name: 'Fighter',
                    slug: 'nuevo-fighter-sin-divisiones'
                })
            
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weights/fighter/${newFighterResponse.body.data.id}`)
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([])
        });

    })

    describe(`GET ${settings.basePath}/weights/:weightId - Obtener una división de un luchador por su id`, () => {
        beforeEach(async () => {
            // Creamos una relación de prueba para el luchador 1
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataOne);
            testWeightId = response.body.data.id;
        })

        test("Deberia retornar una relación mediante su ID y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weights/${testWeightId}`)
            
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('message', 'Peso oficial obtenido correctamente');
        });

        test("Deberia retornar 404 si la relación no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/weights/9999`)
            
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'No se encontró el peso');
        })
    })

    describe(`PATCH ${settings.basePath}/weights/:weightId - Actualizar una relación luchador-division`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataOne);
            testWeightId = response.body.data.id;
        })

        test("Deberia actualizar una relación mediante su ID y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weights/${testWeightId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateWeightData);
            
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('message', 'Peso oficial actualizado correctamente');
        })

        test("Deberia retornar 404 si la relación no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weights/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateWeightData);
            
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'No se encontró el peso');
        })
    })

    describe(`PATCH ${settings.basePath}/weights/soft/:weightId - Soft Delete`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/weights`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockWeightDataOne);
            testWeightId = response.body.data.id;
        });

        test("Deberia eliminar una relación mediante su ID y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weights/soft/${testWeightId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty('message', 'Peso oficial eliminado correctamente');

            // Verficamos que la relación ya no existe
            const checkResponse = await setup.apiInstance
                .get(`${settings.basePath}/weights/${testWeightId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(checkResponse.status).toBe(404)
        })

        test("Deberia retornar 404 si la relación no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/weights/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404)
            expect(response.body).toHaveProperty('message', 'No se encontró el peso');
        })
    })
})
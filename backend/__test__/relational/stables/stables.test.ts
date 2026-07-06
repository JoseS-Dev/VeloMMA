import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    beforeEach,
    afterAll,
    test,
    expect,
    beforeAll
} from "@jest/globals";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

describe("Modulo de equipos de luchadores (stables)", () => {
    let testFighterId: number;
    let testTeamIdOne: number;
    let testTeamIdTwo: number;
    let testStableId: number;
    let testStableIdTwo: number;

    // Datos de prueba para crear un fighter
    const createFighterData = {
        first_name: 'Jon',
        last_name: 'Jones',
        nickname: 'Bones',
        slug: 'jon-jones',
        gender: 'Masculino',
        nationality: 'USA',
        height: 193,
        weight: 93,
        stance: 'Orthodox',
        reach: 215,
        is_active: true
    };

    // Datos de prueba para crear un equipo
    const createTeamData = {
        name_team: 'Jackson Wink MMA',
        description_team: 'Equipo de MMA en Albuquerque, Nuevo México',
        date_founded: '2005-01-01',
        location: 'Albuquerque, Nuevo México',
        is_active: true
    };

    // Datos de prueba para crear un segundo equipo
    const createTeamData2 = {
        name_team: 'American Top Team',
        description_team: 'Equipo de MMA en Coconut Creek, Florida',
        date_founded: '2002-01-01',
        location: 'Coconut Creek, Florida',
        is_active: true
    };

    // Datos de prueba para crear una asignación de equipo
    const createStableData = {
        fighter_id: 0, // Se asignará después
        team_id: 0, // Se asignará después
        is_current: true,
        joined_date: '2023-01-01',
        left_date: null
    };

    // Antes de cada test, se limpia base de datos y se crea los datos de prueba necesarios
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // Creamos al luchador de prueba
        const fighterResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createFighterData);
        testFighterId = fighterResponse.body.data.id;

        // Creamos el primer equipo de prueba
        const teamResponseOne = await setup.apiInstance
            .post(`${settings.basePath}/teams`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createTeamData);
        testTeamIdOne = teamResponseOne.body.data.id;

        // Creamos el segundo equipo de prueba
        const teamResponseTwo = await setup.apiInstance
            .post(`${settings.basePath}/teams`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createTeamData2);
        testTeamIdTwo = teamResponseTwo.body.data.id;

        // Actualizamos los datos de stable
        createStableData.fighter_id = testFighterId;
        createStableData.team_id = testTeamIdOne;
    });

    // Después de todos los tests, cerramos la conexión a la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Definición de los tests
    describe(`POST ${settings.basePath}/stables - crear una asignación de equipo para un luchador`, () => {
        test('Deberia crear una asignación de equipo exitosamente y retornar un status 201', async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Relación equipo con luchador creada exitosamente');
        })

        test("Deberia retornar un status 400 si faltan campos requeridos", async () => {
            const invalidData = {
                fighter_id: testFighterId,
                // team_id falta
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                fighter_id: 9999, // ID de luchador que no existe
                team_id: testTeamIdOne,
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el luchador');
        })

        test("Deberia retornar un status 404 si el equipo no existe", async () => {
            const invalidData = {
                fighter_id: testFighterId,
                team_id: 9999, // ID de equipo que no existe
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        })

        test("Deberia retornar un status 409 si el luchador ya pertenece a dicho equipo", async () => {
            // Primero creamos la asignación de equipo
            await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            
            // Intentamos crear la misma asignación de equipo nuevamente
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'El luchador ya pertence a dicho equipo');
        });

        test("Deberia retornar un status 401 si no se proporciona la API Key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            
            expect(response.status).toBe(401);
        })
    });

    describe(`GET ${settings.basePath}/stables/fighter/:fighterId - obtener todos los equipos de un luchador`, () => {
        // Antes de los tests, creamos una asignación de equipo para el luchador de prueba
        beforeEach(async () => {
            const stableResponseOne = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            testStableId = stableResponseOne.body.data.id;

            // Creamos una segunda asignación de equipo para el mismo luchador
            const createStableDataTwo = {
                fighter_id: testFighterId,
                team_id: testTeamIdTwo,
                is_current: false,
                joined_date: '2020-01-01',
                left_date: '2022-01-01'
            };
            const stableResponseTwo = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableDataTwo);
            testStableIdTwo = stableResponseTwo.body.data.id;
        });

        test("Deberia retornar un status 200 y retornar todas las asignaciones de equipo de un luchador", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stables/fighter/${testFighterId}`)
                
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Relación equipo con luchador obtenida exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.data.length).toBe(2);
        });

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const nonExistentFighterId = 9999; // ID de luchador que no existe
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stables/fighter/${nonExistentFighterId}`)
                
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el luchador');
        });

        test("Deberia retornar un array vacio si el luchador no tiene equipos", async () => {
            // Creamos un nuevo luchador sin equipos
            const newFighterResponse = await setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...createFighterData,
                    first_name: 'New',
                    last_name: 'Fighter',
                });
            const newFighterId = newFighterResponse.body.data.id;

            const response = await setup.apiInstance
                .get(`${settings.basePath}/stables/fighter/${newFighterId}`)
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/stables/:stableId - obtener asignación por ID`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            testStableId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y la asignación de equipo correspondiente al ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stables/${testStableId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Relación equipo con luchador obtenida exitosamente');
        });

        test("Deberia retornar un status 404 si la asignación de equipo no existe", async () => {
            const nonExistentStableId = 9999; // ID de asignación que no existe
            const response = await setup.apiInstance
                .get(`${settings.basePath}/stables/${nonExistentStableId}`)
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        });
    })

    describe(`PATCH ${settings.basePath}/stables/:stableId - actualizar asignación de equipo`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            testStableId = response.body.data.id;
        });

        test("Deberia retornar un status 200 y actualizar la asignación de equipo exitosamente", async () => {
            const updateData = {
                is_current: false,
                left_date: '2024-01-01'
            };
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stables/${testStableId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Relación equipo con luchador actualizada exitosamente');
        });

        test("Deberia retornar un status 404 si la asignación de equipo no existe", async () => {
            const nonExistentStableId = 9999; // ID de asignación que no existe
            const updateData = {
                is_current: false,
                left_date: '2024-01-01'
            };
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stables/${nonExistentStableId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        });
        
    })

    describe(`PATCH ${settings.basePath}/stables/soft/:stableId - eliminar asignación de equipo (soft delete)`, () => {
        beforeEach(async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/stables`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(createStableData);
            testStableId = response.body.data.id;
        });

        test("Deberia retornar un status 200 y eliminar la asignación de equipo exitosamente", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stables/soft/${testStableId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Relación equipo con luchador eliminada exitosamente');
        });

        test("Deberia retornar un status 404 si la asignación de equipo no existe", async () => {
            const nonExistentStableId = 9999; // ID de asignación que no existe
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/stables/soft/${nonExistentStableId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        })
    })
})
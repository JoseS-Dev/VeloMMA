import { TestBase } from "../helpers/testBase.js";
import {
    describe,
    beforeEach,
    afterAll,
    test,
    expect,
    beforeAll
} from '@jest/globals';
import { 
    mockCreateTeamOne,
    mockCreateTeamTwo
 } from "../../mocks/index.js";
import { settings } from "../../config/settings.js";
import { before } from "node:test";

const setup = new TestBase();

// Definición de los test del modulo de los equipos
describe('Test del modulo de los equipos', () => {
    let testTeamOneId: number;
    let testTeamTwoId: number;

    // Antes de cada test, se limpia la base de datos
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();
    })

    // Después de todos los test, se cierra la conexión a la base de datos
    afterAll(async () => {
        await setup.disconnect();
    })

    // Test
    describe(`POST ${settings.basePath}/teams - Crear un nuevo equipo`, () => {
        test('Deberia crear un nuevo equipo y retornar un status 201', async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipo creado correctamente');
        })

        test("Deberia retornar un status 400 si se trata de crear un equipo con datos invalidos", async () => {
            const invalidData = {
                name_team: 0
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
            expect(response.body).toHaveProperty('error');
        })

        test("Deberia retornar un status 409 si ya existe un equipo con el mismo nombre", async () => {
            // Creamos el equipo
            await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            
            // Intentamos crear el mismo equipo nuevamente
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'Ya existe un equipo con ese nombre');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            
            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/teams - Obtener todos los equipos`, () => {
        beforeEach(async () => {
            // Creamos multiples equipos
            await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            
            await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamTwo);
        })

        test("Deberia retornar un status 200 y todos los equipos", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/teams`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar un array vacio si no hay equipos", async () => {
            // Limpiamos la base de datos
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/teams`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        })

    })

    describe(`GET ${settings.basePath}/teams/active - Obtener todos los equipos activos`, () => {
        beforeEach(async () => {
            // Creamos multiples equipos
            await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            
            await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamTwo);
        })

        test("Deberia retornar un status 200 y todos los equipos activos", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/teams/active`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar un array vacio si no hay equipos activos", async () => {
            // Limpiamos la base de datos
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/teams/active`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([]);
        });
    })

    describe(`GET ${settings.basePath}/teams/:teamId - Obtener un equipo por su id`, () => {
        beforeEach(async () => {
            // Creamos un equipo
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            testTeamOneId = response.body.data.id;
        });

        test("Deberia retornar un status 200 y el equipo correspondiente al id", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/teams/${testTeamOneId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipo obtenido correctamente');
        })

        test("Deberia retornar un status 404 si no existe un equipo con el id proporcionado", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/teams/9999`)
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        })
    })

    describe(`PATCH ${settings.basePath}/teams/:teamId - Actualizar un equipo por su ID`, () => {
        beforeEach(async () => {
            // Creamos un equipo
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            testTeamOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y el equipo actualizado", async () => {
            const updateData = {
                name_team: 'Jackson Wink MMA Actualizado',
                description_team: 'Equipo de MMA en Albuquerque, Nuevo México - Actualizado',
                location: 'Albuquerque, NM'
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/${testTeamOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipo actualizado correctamente');
        })

        test("Deberia retornar un status 409 si se trata de actualizar un equipo con un nombre que ya existe", async () => {
            // Creamos un segundo equipo
            const responseTwo = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamTwo);
            testTeamTwoId = responseTwo.body.data.id;

            const updateData = {
                name_team: mockCreateTeamTwo.name_team,
                description_team: 'Equipo de MMA en Albuquerque, Nuevo México - Actualizado',
            }

            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/${testTeamOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'Ya existe un equipo con ese nombre');
        })

        test("Deberia retornar un status 404 si no existe un equipo con el id proporcionado", async () => {
            const updateData = {
                name_team: 'Jackson Wink MMA Actualizado',
                description_team: 'Equipo de MMA en Albuquerque, Nuevo México - Actualizado',
                location: 'Albuquerque, NM'
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        })
    })

    describe(`PATCH ${settings.basePath}/teams/:teamId/status - Cambiar el estado de un equipo por su ID`, () => {
        beforeEach(async () => {
            // Creamos un equipo
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            testTeamOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y el equipo con el estado actualizado", async () => {
            const updateData = {
                isActive: false
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/${testTeamOneId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipo actualizado correctamente');
        })

        test("Deberia retornar un status 400 si el estado que se pasa no es booleano", async () => {
            const updateData = {
                isActive: 'notABoolean'
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/${testTeamOneId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El estado es obligatorio');
        })

        test("Deberia retornar un status 404 si no existe un equipo con el id proporcionado", async () => {
            const updateData = {
                isActive: false
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/9999/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        })
    })

    describe(`PATCH ${settings.basePath}/teams/soft/:teamId - Soft Delete`, () => {
        beforeEach(async () => {
            // Creamos un equipo
            const response = await setup.apiInstance
                .post(`${settings.basePath}/teams`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateTeamOne);
            testTeamOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y el equipo eliminado", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/soft/${testTeamOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Equipo eliminado correctamente');

            // Se verifica que el equipo ya no se puede obtener
            const getResponse = await setup.apiInstance
                .get(`${settings.basePath}/teams/${testTeamOneId}`);
            
            expect(getResponse.status).toBe(404);

        })

        test("Deberia retornar un status 404 si no existe un equipo con el id proporcionado", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/teams/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el equipo');
        })
    })
})
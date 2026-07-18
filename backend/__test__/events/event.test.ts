import { TestBase } from "../helpers/testBase.js";
import { 
    mockEventOne,
    mockEventTwo,
    mockEventThree,
    mockEventUpdateData 
} from "../../mocks/index.js";
import { 
    describe,
    beforeAll,
    afterAll,
    expect,
    beforeEach, 
    test
} from "@jest/globals";
import { settings } from "../../config/settings.js";

const setup = new TestBase();

// Definición de los test de los eventos
describe('Modulo de Eventos', () => {
    let testEventOneId: number;
    let testEventTwoId: number;
    let testEventThreeId: number;

    // Antes de todos los test, se limpia la base de datos
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();
    })

    // Después de todos los test, se cierra la conexión a la base de datos
    afterAll(async () => {
        await setup.disconnect();
    })

    describe(`POST ${settings.basePath}/events - Crear un nuevo evento`, () => {
        test("Deberia crear un nuevo evento y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Evento creado correctamente');
        })

        test("Deberia retonar un status 400 si trata de crear con datos invalidos", async () => {
            const invalidData = {
                name_event: 0
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 409 si trata de crear un evento con un nombre ya existente", async () => {
            // Primero se crea un evento
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            
            // Luego se intenta crear otro evento con el mismo nombre
            const response = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('status', 409);
            expect(response.body).toHaveProperty('message', 'Ya existe un evento con ese nombre');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            
            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/events - Obtener todos los eventos`, () => {
        beforeEach(async () => {
            // Se crea multiples eventos para las pruebas
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventTwo);
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventThree);
        })

        test("Deberia retornar todos los eventos y un status de 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Eventos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test("Deberia retornar un array vacio si no hay eventos", async () => {
            // Se limpia la base de datos
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Eventos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

    })

    describe(`GET ${settings.basePath}/events/active - Obtener todos los eventos activos`, () => {
        beforeEach(async () => {
            // Se crea multiples eventos para las pruebas
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventTwo);
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventThree);
        })

        test("Deberia retornar todos los eventos activos y un status de 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events/active`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Eventos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test("Deberia retornar un array vacio si no hay eventos activos", async () => {
            // Se limpia la base de datos
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events/active`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Eventos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })
    })

    describe(`GET ${settings.basePath}/events/location/:location - Obtener eventos por ubicación`, () => {
        beforeEach(async () => {
            // Se crea multiples eventos para las pruebas
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventTwo);
            
            await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventThree);
        });

        test("Deberia retornar todos los eventos de una locación especifica y un status de 200", async () => {
            const location = 'Las Vegas, Nevada';
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events/location/${encodeURIComponent(location)}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Eventos obtenidos correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retonar un array vacio si no hay eventos en esa locación", async () => {
            const location = 'Venezuela';
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events/location/${encodeURIComponent(location)}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontraron eventos en esa locación');
        })
    
    })

    describe(`GET ${settings.basePath}/events/:eventId - Obtener un evento por su id`, () => {
        beforeEach(async () => {
            // Se crea multiples eventos para las pruebas
            const responseOne = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            testEventOneId = responseOne.body.data.id;
        })

        test("Deberia retornar un evento por su id y un status de 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events/${testEventOneId}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Evento obtenido correctamente');
        })

        test("Deberia retornar un status 404 si no se encuentra el evento", async () => {
            const nonExistentEventId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/events/${nonExistentEventId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró el evento');
        })
    })

    describe(`PATCH ${settings.basePath}/events/:eventId - Actualizar un evento`, () => {
        beforeEach(async () => {
            // Se crea un evento para las pruebas
            const responseOne = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            testEventOneId = responseOne.body.data.id;
        })

        test("Deberia actualizar un evento y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/${testEventOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventUpdateData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Evento actualizado correctamente');
        })

        test("Deberia retornar un status 404 si no se encuentra el evento a actualizar", async () => {
            const nonExistentEventId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/${nonExistentEventId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventUpdateData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró el evento');
        })

        test("Deberia retornar un status 409 si se intenta actualizar un evento con un nombre ya existente", async () => {
            // Se crea un segundo evento para las pruebas
            const responseTwo = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventTwo);
            testEventTwoId = responseTwo.body.data.id;

            // Se intenta actualizar el primer evento con el nombre del segundo evento
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/${testEventOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({ name_event: mockEventTwo.name_event });
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('status', 409);
            expect(response.body).toHaveProperty('message', 'Ya existe un evento con ese nombre');
        })
    })

    describe(`PATCH ${settings.basePath}/events/:eventId/status - Cambiar el estado de un evento`, () => {
        beforeEach(async () => {
            // Se crea un evento para las pruebas
            const responseOne = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            testEventOneId = responseOne.body.data.id;
        })

        test("Deberia cambiar el estado de un evento y retornar un status 200", async () => {
            const updateStatus = {
                isActive: false
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/${testEventOneId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateStatus);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Evento actualizado correctamente');
        })

        test("Deberia retornar un status 404 si no se encuentra el evento a actualizar", async () => {
            const nonExistentEventId = 9999;
            const updateStatus = {
                isActive: false
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/${nonExistentEventId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateStatus);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró el evento');
        })

        test("Deberia retornar un status 400 si se envia un valor no booleano para isActive", async () => {
            const updateStatus = {
                isActive: "notABoolean"
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/${testEventOneId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updateStatus);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El parámetro isActive debe ser un booleano');
        })
    })

    describe(`PATCH ${settings.basePath}/events/soft/:eventId - Eliminar un evento (soft delete)`, () => {
        beforeEach(async () => {
            // Se crea un evento para las pruebas
            const responseOne = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventOne);
            testEventOneId = responseOne.body.data.id;
        })

        test("Deberia eliminar un evento y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/soft/${testEventOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Evento eliminado correctamente');
        })

        test("Deberia retornar un status 404 si no se encuentra el evento a eliminar", async () => {
            const nonExistentEventId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/events/soft/${nonExistentEventId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró el evento');
        })
    })

})
import { TestBase } from "../helpers/testBase.js";
import { 
    mockCreateDivisionOne,
    mockCreateDivisionTwo 
} from "../../mocks/index.js";
import {
    describe,
    expect,
    beforeAll,
    beforeEach,
    afterAll,
    test
} from "@jest/globals";
import { settings } from "../../config/settings.js";

const setup = new TestBase();

// Definición de los test para la ruta /divisions las divisiones de los pesos
describe('Modulo de las divisiones de los pesos', () => {
    let testDivisionOneId: number;
    let testDivisionTwoId: number;

    // Antes de cada test, se limpia la base de datos
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();
    });

    // Después de todos los tests, se desconecta de la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Test
    describe(`POST ${settings.basePath}/divisions - Crear una nueva división`, () => {
        test("Deberia retornar un status 201 y la division creada", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Division creada correctamente');
        })

        test("Deberia retornar un status 400 si los datos son invalidos", async () => {
            const invalidData = {
                name_division: 0
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 409 si la division ya existe", async () => {
            // creamos una division
            await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            // intentamos crear la misma division nuevamente
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            
            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('status', 409);
            expect(response.body).toHaveProperty('message', 'Ya existe una division con ese nombre');
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            
            expect(response.status).toBe(401);
        })         
    })

    describe(`GET ${settings.basePath}/divisions - Obtener todas las divisiones`, () => {
        // Creamos multiples divisiones de prueba
        beforeEach(async() => {
            await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionTwo);
        })

        test("Deberia retornar un status 200 y todas las divisiones", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/divisions`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Divisiones obtenidas correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar un array vacio si no hay divisiones", async () => {
            // limpio la base de datos
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/divisions`)
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/divisions/active - Obtener todas las divisiones activas`, () => {
        // Creamos multiples divisiones de prueba
        // Creamos multiples divisiones de prueba
        beforeEach(async() => {
            await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionTwo);
        })

        test("Deberia retornar un status 200 y todas las divisiones", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/divisions/active`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Divisiones obtenidas correctamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar un array vacio si no hay divisiones", async () => {
            // limpio la base de datos
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/divisions/active`)
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/divisions/:divisionId - Obtener una division por su id`, () => {
        beforeEach(async() => {
            // Creamos una division de prueba
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            testDivisionOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y la division correspondiente", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/divisions/${testDivisionOneId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Division obtenida correctamente');
        })

        test("Deberia retornar un status 404 si la division no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/divisions/9999`)
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró la division');
        })
    })

    describe(`PATCH ${settings.basePath}/divisions/:divisionId - Actualizar una division`, () => {
        beforeEach(async() => {
            // Creamos una division de prueba
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            testDivisionOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y la division actualizada", async () => {
            const updatedData = {
                name_division: 'Peso Medio',
                weight_class: 'Middleweight',
                gender: 'Masculino',
                is_active: true
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/${testDivisionOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Division actualizada correctamente');
        })

        test("Deberia retornar un status 400 si los datos son invalidos", async () => {
            const invalidData = {
                name_division: 0
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/${testDivisionOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 404 si la division no existe", async () => {
            const updatedData = {
                name_division: 'Peso Medio',
                weight_class: 'Middleweight',
                gender: 'Masculino',
                is_active: true
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró la division');
        })

        test("Deberia retornar un status 409 si la division ya existe", async () => {
            // Creamos otra division de prueba
            const responseTwo = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionTwo);
            testDivisionTwoId = responseTwo.body.data.id;

            const updatedData = {
                name_division: mockCreateDivisionTwo.name_division,
                weight_class: 'Middleweight',
                gender: 'Masculino',
                is_active: true
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/${testDivisionOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedData);

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('status', 409);
            expect(response.body).toHaveProperty('message', 'Ya existe una division con ese nombre');
        })
    })

    describe(`PATCH ${settings.basePath}/divisions/:divisionId/status - Cambiar el estado de una division`, () => {
        beforeEach(async() => {
            // Creamos una division de prueba
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            testDivisionOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y la division actualizada", async () => {
            const updatedData = {
                isActive: false
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/${testDivisionOneId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Division actualizada correctamente');
        })

        test("Deberia retornar un status 400 si los datos son invalidos", async () => {
            const invalidData = {
                isActive: 'false'
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/${testDivisionOneId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('status', 400);
            expect(response.body).toHaveProperty('message', 'El estado no es un booleano');
        })

        test("Deberia retornar un status 404 si la division no existe", async () => {
            const updatedData = {
                isActive: false
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/9999/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró la division');
        })
    })

    describe(`PATCH ${settings.basePath}/divisions/soft/:divisionId - Eliminar una division`, () => {
        beforeEach(async() => {
            // Creamos una division de prueba
            const response = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionOne);
            testDivisionOneId = response.body.data.id;
        })

        test("Deberia retornar un status 200 y la division eliminada", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/soft/${testDivisionOneId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Division eliminada correctamente');

            // verificamos que la division ya no esta activa
            const getResponse = await setup.apiInstance
                .get(`${settings.basePath}/divisions/${testDivisionOneId}`);
            expect(getResponse.status).toBe(404);
        })

        test("Deberia retornar un status 404 si la division no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/divisions/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'No se encontró la division');
        })
    })
})
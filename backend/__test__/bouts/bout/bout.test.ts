import { TestBase } from "../../helpers/testBase.js";
import { 
    describe,
    beforeEach,
    afterAll,
    expect,
    test 
} from "@jest/globals";
import { 
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockCreateDivisionOne,
    mockCreateDivisionTwo,
    mockEventOne,
    mockBoutOne,
    mockBoutTwo,
    mockUpdateBoutData, 
    mockEventTwo
} from "../../../mocks/index.js";
import { settings } from "../../../config/settings.js";

const setup = new TestBase();

// Definición de los test de las peleas de los eventos de una división en especifico
describe('Modulo de peleas de eventos de una división en especifico', () => {
    let testEventId: number;
    let testDivisionId: number;
    let testRedCornerId: number;
    let testBlueCornerId: number;
    let testBoutId: number;


    // Antes de cada test se limpia la base de datos y se crean los datos necesarios para los test
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // Creamos el evento, luchadores y la división para los test
        const eventResponse = await setup.apiInstance
            .post(`${settings.basePath}/events`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockEventOne);
        testEventId = eventResponse.body.data.id;

        const divisionResponse = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionOne);
        testDivisionId = divisionResponse.body.data.id;

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

        // Actualizamos los datos de la pelea
        mockBoutOne.event_id = testEventId;
        mockBoutOne.division_id = testDivisionId;
        mockBoutOne.red_corner_id = testRedCornerId;
        mockBoutOne.blue_corner_id = testBlueCornerId;

        mockBoutTwo.event_id = testEventId;
        mockBoutTwo.division_id = testDivisionId;
        mockBoutTwo.red_corner_id = testRedCornerId;
        mockBoutTwo.blue_corner_id = testBlueCornerId;

    })

    // Despues de cada test se desconecta de la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Test
    describe(`POST ${settings.basePath}/bouts - Crear una pelea`, () => {
        test("Deberia crear una pelea correctamente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201)
            expect(response.body).toHaveProperty('message', 'Pelea creada exitosamente');
            testBoutId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si falan campos requeridos", async () => {
            const invalidData = {
                event_id: testEventId,
                division_id: testDivisionId,
                red_corner_id: testRedCornerId
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación')
        })

        test("Deberia retornar un status 404 si el evento no existe", async () => {
            const invalidData = {
                ...mockBoutOne,
                event_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el evento')
        })

        test("Deberia retornar un status 404 si la divisiòn no existe", async () => {
            const invalidData = {
                ...mockBoutOne,
                division_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la división')
        })

        test("Deberia retornar un status 404 si el luchador rojo no existe", async () => {
            const invalidData = {
                ...mockBoutOne,
                red_corner_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador rojo')
        })

        test("Deberia retornar un status 404 si el luchador azul no existe", async () => {
            const invalidData = {
                ...mockBoutOne,
                blue_corner_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el luchador azul')
        })

        test("Deberia retornar un status 401 si no se envia la api key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/bouts - Obtener todas las peleas`, () => {
        beforeEach(async () => {
            // Creamos múltiples peleas
            await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutTwo);
        })

        test("Deberia retornar todas las pleas y un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts`)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Peleas obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar un array vacio si no hay peleas", async () => {
            await setup.clearDatabase();
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts`)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/bouts/event/:eventId - Obtener peleas por evento`, () => {
        beforeEach(async () => {
            // Creamos múltiples peleas
            await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutTwo);

        })

        test("Deberia retornar un todas las peleas de un evento especifico", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/event/${testEventId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Peleas obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);

            // Se verifica que todas las peleas tengan el mismo event_id
            response.body.data.forEach((bout: any) => {
                expect(bout.event_id).toBe(testEventId);
            })
        })

        test("Deberia retornar un status 404 si el evento no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/event/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe el evento');
        })

        test("Deberia retornar un array vacio si no hay peleas para el evento", async () => {
            // Creamos un evento sin peleas
            const eventResponse = await setup.apiInstance
                .post(`${settings.basePath}/events`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockEventTwo);
            const newEventId = eventResponse.body.data.id;

            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/event/${newEventId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([])
        })
    })

    describe(`GET ${settings.basePath}/bouts/division/:divisionId - Obtener peleas por división`, () => {
        beforeEach(async () => {
            // Creamos múltiples peleas
            await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutTwo);
        })

        test("Deberia retornar un todas las peleas de una división especifica", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/division/${testDivisionId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Peleas obtenidas exitosamente');
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar un status 404 si la división no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/division/9999`)
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la división');
        })

        test("Deberia retornar un array vacio si no hay peleas para la división", async () => {
            // Creamos una división sin peleas
            const divisionResponse = await setup.apiInstance
                .post(`${settings.basePath}/divisions`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateDivisionTwo);
            const newDivisionId = divisionResponse.body.data.id;

            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/division/${newDivisionId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body.data).toEqual([])
        })
    })

    describe(`GET ${settings.basePath}/bouts/:boutId - Obtener una pelea por ID`, () => {
        beforeEach(async () => {
            // Creamos una pelea
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            testBoutId = response.body.data.id;
        })

        test("Deberia retornar una pelea por su ID", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/${testBoutId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pelea obtenida exitosamente');
            expect(response.body.data.id).toBe(testBoutId);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/bouts/9999`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })
    })

    describe(`PATCH ${settings.basePath}/bouts/:boutId - Actualizar una pelea`, () => {
        beforeEach(async () => {
            // Creamos una pelea
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            testBoutId = response.body.data.id;
        })

        test("Deberia actualizar una pelea correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/${testBoutId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateBoutData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pelea actualizada exitosamente');
            expect(response.body.data.id).toBe(testBoutId);
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockUpdateBoutData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })

        test("Deberia retornar un status 400 si no se envian datos para actualizar", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/${testBoutId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Los datos son obligatorios');
        })
    })

    describe(`PATCH ${settings.basePath}/bouts/:boutId/status - Cambiar estado de una pelea`, () => {
        beforeEach(async () => {
            // Creamos una pelea
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            testBoutId = response.body.data.id;
        })

        test("Deberia cambiar el estado de una pelea correctamente y retornar un status 200", async () => {
           const newStatus = 'En_Proceso';
           const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/${testBoutId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({ status: newStatus });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Estado de la pelea cambiado exitosamente');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const newStatus = 'En_Proceso';
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/9999/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({ status: newStatus });
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })

        test("Deberia cambiar a Finalizada", async () => {
            await setup.apiInstance
                .patch(`${settings.basePath}/bouts/${testBoutId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({ status: 'En_Proceso' });
            
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/${testBoutId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({ status: 'Finalizada' });
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Estado de la pelea cambiado exitosamente');
            expect(response.body.data.status_bout).toBe('Finalizada');
        })
    })

    describe(`PATCH ${settings.basePath}/bouts/soft/:BoutId - Soft Delete`, () => {
        beforeEach(async () => {
            // Creamos una pelea
            const response = await setup.apiInstance
                .post(`${settings.basePath}/bouts`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockBoutOne);
            testBoutId = response.body.data.id;
        })

        test("Deberia eliminar una pelea correctamente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/soft/${testBoutId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Pelea eliminada exitosamente');
        })

        test("Deberia retornar un status 404 si la pelea no existe", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/bouts/soft/9999`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No existe la pelea');
        })
    })

})

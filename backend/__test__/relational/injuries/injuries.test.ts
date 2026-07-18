import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    beforeEach,
    afterAll,
    test,
    expect
} from "@jest/globals";
import { settings } from "../../../config/settings.js";
import { 
    mockCreateFighterOne,
    mockCreateInjuryOne,
    mockCreateInjuryTwo 
} from "../../../mocks/index.js";

const setup = new TestBase();

// Definición de los tests para las rutas de las lesiones de un luchador
describe("Modulo de Lesiones de un luchador", () => {
    let testFighterId: number;
    let testInjuryId: number;
    let testInjuryId2: number;

    // Datos de prueba para crear una segunda lesión
    const mockCreateInjuryTwo = {
        fighter_id: 0,
        description_injury: 'Esguince de tobillo',
        severity_injury: 'Severo',
        injury_date: '2023-03-01T00:00:00.000Z',
        recovery_date: '2023-03-15T00:00:00.000Z'
    }

    // Antes de cada test, se limpia la base de datos y se crean un luchador
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // Creamos el luchador para asociarlo con las lesiones
        const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterOne);
        
        testFighterId = response.body.data.id;
        mockCreateInjuryOne.fighter_id = testFighterId;
        mockCreateInjuryTwo.fighter_id = testFighterId;
    });

    // Después de todos los tests, se cierra la conexión a la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Definición de los tests para las rutas de lesiones
    describe(`POST ${settings.basePath}/injuries - Crear una nueva lesión`, () => {
        test("Deberia crear una nueva lesión para un luchador existente y retornar un status 201", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201)
            expect(response.body).toHaveProperty('message', 'Lesión o inactividad creada correctamente')
            
            testInjuryId = response.body.data.id;
        })

        test("Deberia retornar un status 400 si los datos de la lesión son inválidos", async () => {
            const invalidInjuryData = {
                fighter_id: testFighterId,
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidInjuryData);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const invalidData = {
                ...mockCreateInjuryOne,
                fighter_id: 9999
            }
            const response = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(invalidData);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el luchador');
        })

        test("Deberia retornar un status 401 si no se proporciona la API key", async () => {
            const response = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            
            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/injuries/fighter/:fighterId - Obtener todas las lesiones de un luchador`, () => {
        // Antes se crea dos lesiones para el luchador de prueba
        beforeEach(async () => {
            const injuryResponseOne = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            testInjuryId = injuryResponseOne.body.data.id;

            const injuryResponseTwo = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryTwo);
            testInjuryId2 = injuryResponseTwo.body.data.id;
        })

        test("Deberia retornar todas las lesiones de un luchador existente y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${testFighterId}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesiones o inactividades obtenidas correctamente')
            expect(Array.isArray(response.body.data)).toBe(true);

            // Se verifica que ambas lesiones creadas estén presentes en la respuesta
            const descriptions = response.body.data.map((injury: any) => injury.description_injury);
            expect(descriptions).toContain(mockCreateInjuryOne.description_injury);
            expect(descriptions).toContain(mockCreateInjuryTwo.description_injury);
        });

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const noExistingFighterId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${noExistingFighterId}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el luchador');
        })

        test("Deberia retornar un array vacio si el luchador no tiene lesiones", async () => {
            // Se crea un nuevo luchador sin lesiones
            const newFighter = await setup.apiInstance
                .post(`${settings.basePath}/fighters`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateFighterOne,
                    first_name: 'New',
                    last_name: 'Fighter'
                });
            
            const newFighterId = newFighter.body.data.id;
            
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${newFighterId}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body.data).toEqual([]);
        })
    });

    describe(`GET ${settings.basePath}/injuries/fighter/:fighterId/severity - Obtener lesiones por severidad`, () => {
        // Antes se crea tres lesiones para el luchador con distintos grados de severidad
        beforeEach(async () => {
            await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            
            await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryTwo);
            
            await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    ...mockCreateInjuryOne,
                    description_injury: 'Corte en la ceja',
                    severity_injury: 'Menor'
                });
        });

        test("Deberia retornar todas las lesiones de un luchador por un grado de severidad: Menor y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${testFighterId}/severity?severity=Menor`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesiones o inactividades obtenidas correctamente')
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar todas las lesiones de un luchador por un grado de severidad: Moderado y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${testFighterId}/severity?severity=Moderado`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesiones o inactividades obtenidas correctamente')
            expect(Array.isArray(response.body.data)).toBe(true);
        })

        test("Deberia retornar todas las lesiones de un luchador por un grado de severidad: Severo y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${testFighterId}/severity?severity=Severo`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesiones o inactividades obtenidas correctamente')
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        test("Deberia retornar un status 400 si no se especifica la severidad", async() => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${testFighterId}/severity`);
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Debe especificar la severidad de la lesión');
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const noExistingFighterId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${noExistingFighterId}/severity?severity=Moderado`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró el luchador');
        })

        test("Deberia retornar un array vacio si el luchador no tiene lesiones con la severidad especificada", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/fighter/${testFighterId}/severity?severity=Critica`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body.data).toEqual([]);
        })
    });

    describe(`GET ${settings.basePath}/injuries/:injuryId - Obtener una lesión por su ID`, () => {
        // Antes se crea una lesión para el luchador de prueba
        beforeEach(async () => {
            const injuryResponse = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            testInjuryId = injuryResponse.body.data.id;
        });

        test("Deberia retornar una lesión existente por su ID y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/${testInjuryId}`);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesión o inactividad obtenida correctamente')
        })

        test("Deberia retornar un status 404 si la lesión no existe", async () => {
            const noExistingInjuryId = 9999;
            const response = await setup.apiInstance
                .get(`${settings.basePath}/injuries/${noExistingInjuryId}`);
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró la lesión o inactividad');
        })

    })

    describe(`PATCH ${settings.basePath}/injuries/:injuryId - Actualizar una lesión por su ID`, () => {
        // Antes se crea una lesión para el luchador de prueba
        beforeEach(async () => {
            const injuryResponse = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            testInjuryId = injuryResponse.body.data.id;
        });

        test("Deberia actualizar una lesión existente por su ID y retornar un status 200", async () => {
            const updatedInjuryData = {
                description_injury: 'Fractura de brazo actualizada',
                severity_injury: 'Severo',
                injury_date: '2023-01-15T00:00:00.000Z',
                recovery_date: '2023-02-15T00:00:00.000Z'
            }
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${testInjuryId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(updatedInjuryData);
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesión o inactividad actualizada correctamente')
        })

        test("Deberia retornar un status 404 si la lesión no existe", async () => {
            const noExistingInjuryId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${noExistingInjuryId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({
                    description_injury: 'Lesión inexistente'
                });
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró la lesión o inactividad');
        })
    })

    describe(`PATCH ${settings.basePath}/injuries/:injuryId/status - Cambiar el estado de una lesión por su ID`, () => {
        // Antes se crea una lesión para el luchador de prueba
        beforeEach(async () => {
            const injuryResponse = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            testInjuryId = injuryResponse.body.data.id;
        });

        test("Deberia desactivar una lesión existente por su ID y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${testInjuryId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({isActive: false});
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesión o inactividad actualizada correctamente')
            expect(response.body.data).toHaveProperty('is_active', false);
        })

        test("Deberia activar una lesión existente por su ID y retornar un status 200", async () => {
            // Primero desactivamos la lesión
            await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${testInjuryId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({isActive: false});
            
            // Luego la activamos nuevamente
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${testInjuryId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({isActive: true});
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesión o inactividad actualizada correctamente')
            expect(response.body.data).toHaveProperty('is_active', true);
        })

        test("Deberia retornar un status 400 si isActive no es un booleano", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${testInjuryId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({isActive: "notABoolean"});
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'El estado es obligatorio');
        })

        test("Deberia retornar un status 404 si la lesión no existe", async () => {
            const noExistingInjuryId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/${noExistingInjuryId}/status`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send({isActive: false});
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró la lesión o inactividad');
        })
    })

    describe(`PATCH ${settings.basePath}/injuries/soft/:injuryId - Eliminar una lesión por su ID (Soft Delete)`, () => {
        // Antes se crea una lesión para el luchador de prueba
        beforeEach(async () => {
            const injuryResponse = await setup.apiInstance
                .post(`${settings.basePath}/injuries`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json')
                .send(mockCreateInjuryOne);
            testInjuryId = injuryResponse.body.data.id;
        });

        test("Deberia eliminar una lesión existente haciendo soft delete y retornar un status 200", async () => {
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/soft/${testInjuryId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200)
            expect(response.body).toHaveProperty('message', 'Lesión o inactividad eliminada correctamente')
        })

        test("Deberia retornar un status 404 si la lesión no existe", async () => {
            const noExistingInjuryId = 9999;
            const response = await setup.apiInstance
                .patch(`${settings.basePath}/injuries/soft/${noExistingInjuryId}`)
                .set('x-api-key', settings.apiKey)
                .set('Content-Type', 'application/json');
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'No se encontró la lesión o inactividad');
        })
    })
})
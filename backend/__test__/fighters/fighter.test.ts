import { TestBase } from "../helpers/testBase.js";
import { 
    describe, 
    beforeEach, 
    afterAll, 
    test,
    expect 
} from "@jest/globals";
import { settings } from "../../config/settings.js";

const setup = new TestBase();

describe("Modulo de Fighters", () => {
    
    // Antes de cada de esté modulo, se limpia la base de datos
    beforeEach(async () => {
        await setup.clearDatabase();
    });

    // Al finalizar todos los tests, se cierra la conexión a la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Datos de prueba para crear un nuevo luchador
    const createdFighterData = {
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
    }

    // Definición de los tests para el módulo de fighters
    describe(`POST ${settings.basePath}/fighters`, () => {
        test("Deberia crear un nuevo luchador y retornar un status 201", async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('status', 201);
            expect(response.body).toHaveProperty('message', 'Luchador creado correctamente');
            expect(response.body.data).toMatchObject(createdFighterData);

        });

        test("Deberia retornar un status 400 si falta campos requeridos", async () => {
            const invalidData = {
                first_name: 'Jon',
            }
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Error de validación');
        })

        test("Deberia retornar un status 409 si el slug ya existe", async () => {
            // crear primer fighter
            await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);

            // Intentar crear un segundo fighter con el mismo slug
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('message', 'El slug ya existe');
        })

        test('Deberia retornar un status 401 si no se proporciona la API key', async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);

            expect(response.status).toBe(401);
        })
    })

    describe(`GET ${settings.basePath}/fighters - Obtener todos los luchadores`, () => {
        // Nos aseguramos de que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
        })
        
        test("Deberia retornar un status 200 y un array de luchadores", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters`)

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveProperty('status', 200);
        });
        
        test("Deberia retornar los primeros 5 luchaodres con paginación", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters?limit=5`)

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.meta).toMatchObject({
                total: expect.any(Number),
                page: 1,
                limit: 5
            })
        });

        test("Deberia retornar la pagina 2 con limit=5", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters?page=2&limit=5`)

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body.meta).toMatchObject({
                total: expect.any(Number),
                page: 2,
                limit: 5
            })
        });

        test("Deberia retornar un array vacio si no hay luchadores", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters`)

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/fighters/active - Obtener luchadores activos`, () => {
        // Nos aseguramos de que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
        });

        test("Deberia retornar un status 200 y un array de luchadores activos", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters/active`)

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchadores obtenidos correctamente');
        })

        test("Deberia retornar un array vacio si no hay luchadores activos", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters/active`)

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual([]);
        })
    })

    describe(`GET ${settings.basePath}/fighters/:fighterId - Obtener un luchador por ID`, () => {
        let fighterId: number;
        // Nos aseguramos que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
            fighterId = response.body.data.id;
        })
        test("Deberia retornar un status 200 y el luchador correspondiente al ID", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters/${fighterId}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchador obtenido correctamente');
            expect(response.body.data).toMatchObject(createdFighterData);
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const nonExistentId = 9999;
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters/${nonExistentId}`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })
    })

    describe(`GET ${settings.basePath}/fighters/slug/:slug - Obtener un luchador por slug`, () => {
        let fighterSlug: string;
        // Nos aseguramos que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
            fighterSlug = response.body.data.slug;
        })
        test("Deberia retornar un status 200 y el luchador correspondiente al slug", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters/slug/${fighterSlug}`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchador obtenido correctamente');
            expect(response.body.data).toMatchObject(createdFighterData);
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const nonExistentSlug = 'non-existent-slug';
            const response = await setup.apiInstance
            .get(`${settings.basePath}/fighters/slug/${nonExistentSlug}`)

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })
    })

    describe(`PATCH ${settings.basePath}/fighters/:fighterId - Actualizar un luchador`, () => {
        let fighterId: number;
        // Nos aseguramos que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
            fighterId = response.body.data.id;
        })

        test("Deberia actualizar un luchador y retornar un status 200", async () => {
            const updatedData = {
                nickname: 'The Prodigy',
                height: 195
            }
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${fighterId}`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchador actualizado correctamente');
            expect(response.body.data).toMatchObject({
                ...createdFighterData,
                ...updatedData
            });
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const nonExistentId = 9999;
            const updatedData = {
                nickname: 'The Prodigy',
                height: 195
            }
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${nonExistentId}`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(updatedData);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })

        test("Deberia retornar un status 409 si el slug ya existe al actualizar el nombre y apellido", async () => {
            // Crear un segundo luchador con un slug diferente
            await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send({
                ...createdFighterData,
                first_name: 'Daniel',
                last_name: 'Cormier',
                slug: 'daniel-cormier'
            });
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${fighterId}`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send({
                first_name: 'Daniel',
                last_name: 'Cormier'
            });

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('status', 409);
            expect(response.body).toHaveProperty('message', 'El slug ya existe');
        })
    });

    describe(`PATCH ${settings.basePath}/fighters/:fighterId/status - Cambiar el estado de un luchador`, () => {
        let fighterId: number;
        // Nos aseguramos que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
            fighterId = response.body.data.id;
        })

        test("Deberia cambiar el estado de un luchador y retornar un status 200", async () => {
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${fighterId}/status`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send({status: false});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchador actualizado correctamente');
            expect(response.body.data).toHaveProperty('is_active', false);
        })

        test("Deberia activar el estado de un luchador y retornar un status 200", async () => {
            // Primero desactivamos el luchador
            await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${fighterId}/status`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send({status: false});

            // Luego activamos el luchador
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${fighterId}/status`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send({status: true});

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchador actualizado correctamente');
            expect(response.body.data).toHaveProperty('is_active', true);
        })

        test('Deberia retornar un status 400 si el estado no es booleano', async () => {
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/${fighterId}/status`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send({status: 'invalid'});

            expect(response.status).toBe(400);
        })
    })

    describe(`PATCH ${settings.basePath}/fighters/soft/:fighterId - Eliminar un luchador`, () => {
        let fighterId: number;
        // Nos aseguramos que haya al menos un luchador en la base de datos antes de ejecutar este test
        beforeEach(async () => {
            const response = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(createdFighterData);
            fighterId = response.body.data.id;
        })

        test("Deberia hacer soft delete de un luchador y retornar un status 200", async() => {
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/soft/${fighterId}`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message', 'Luchador eliminado correctamente');

            // Verificamos que el luchador ya no esté activo
            const getResponse = await setup.apiInstance
            .get(`${settings.basePath}/fighters/${fighterId}`);

            expect(getResponse.status).toBe(404);
        })

        test("Deberia retornar un status 404 si el luchador no existe", async () => {
            const nonExistentId = 9999;
            const response = await setup.apiInstance
            .patch(`${settings.basePath}/fighters/soft/${nonExistentId}`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('status', 404);
            expect(response.body).toHaveProperty('message', 'El luchador no existe');
        })
    });
})

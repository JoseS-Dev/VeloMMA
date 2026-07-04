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
    let testFighterId: number;
    let testFighterSlug: string;

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
    describe("POST /fighters - Crear un nuevo luchador", () => {
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

            testFighterId = response.body.data.id;
            testFighterSlug = response.body.data.slug;

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
    })
})

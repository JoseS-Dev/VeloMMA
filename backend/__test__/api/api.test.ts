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

// Definición de los tests para las rutas de bienvenida, health, ping y docs
describe("Rutas de bienvenida, health, ping y docs", () => {
    // Antes de cada test, se limpia la base de datos
    beforeEach(async () => {
        await setup.clearDatabase();
    })

    // Al finalizar todos los tests, se cierra la conexión a la base de datos
    afterAll(async () => {
        await setup.disconnect();
    });

    // Test para la ruta de bienvenida
    describe(`GET ${settings.basePath} - Ruta de bienvenida`, () => {
        test("Deberia retornar un status 200 y un mensaje de bienvenida", async () => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}`)
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Bienvenido a la API de VeloMMA');
        })
    })

    describe(`GET ${settings.basePath}/health - Ruta de health`, () => {
        test("Deberia retornar un status 200 y un objeto con información de health", async() => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/health`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'OK');
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('memory');
            expect(response.body).toHaveProperty('version');
            expect(response.body).toHaveProperty('environment');
        })
    })

    describe(`GET ${settings.basePath}/ping - Ruta de ping`, () => {
        test("Deberia retornar un status 200 y un mensaje de pong", async() => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/ping`)

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'pong');
        })
    })

    describe(`GET ${settings.basePath}/docs - Ruta de documentación`, () => {
        test("Deberia retornar un status 200 y la documentación de la API", async() => {
            const response = await setup.apiInstance
            .get(`${settings.basePath}/docs`)

            expect(response.status).toBe(200);
        })
    })
})
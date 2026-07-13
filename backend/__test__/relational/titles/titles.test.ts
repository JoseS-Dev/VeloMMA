import { TestBase } from "../../helpers/testBase.js";
import {
    describe,
    beforeEach,
    afterEach,
    expect,
    test,
    beforeAll,
} from "@jest/globals";
import { settings } from "../../../config/settings.js";
import { 
    mockCreateFighterOne,
    mockCreateFighterTwo,
    mockCreateDivisionOne,
    mockCreateDivisionTwo,
    mockCreateTitleOne,
    updateTitleData 
} from "../../../mocks/index.js";

const setup = new TestBase();

// Definición de los tests para la entidad "Titles"
describe("Modulo de los Titulos de luchadores", () => {
    let testFighterId: number;
    let testFighterId2: number;
    let testDivisionId: number;
    let testDivisionId2: number;
    let testTitleId: number;

    // Antes de cada test, se limpia la base de datos y se crean los datos necesarios para los tests
    beforeEach(async () => {
        await setup.clearDatabase();
        await setup.clearDatabaseDeleteMany();

        // Se crea el primer luchador de prueba
        const fighterResponse = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterOne);
        testFighterId = fighterResponse.body.id;

        // Se crea el segundo luchador de prueba
        const fighterResponse2 = await setup.apiInstance
            .post(`${settings.basePath}/fighters`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateFighterTwo);
        testFighterId2 = fighterResponse2.body.id;

        // Se crea la primera división de prueba
        const divisionResponse = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionOne);
        testDivisionId = divisionResponse.body.id;

        // Se crea la segunda división de prueba
        const divisionResponse2 = await setup.apiInstance
            .post(`${settings.basePath}/divisions`)
            .set('x-api-key', settings.apiKey)
            .set('Content-Type', 'application/json')
            .send(mockCreateDivisionTwo);
        testDivisionId2 = divisionResponse2.body.id;

        // Actaulizamos los datos de los titulos
        mockCreateTitleOne.fighter_id = testFighterId;
        mockCreateTitleOne.division_id = testDivisionId;
    });

    // Después de cada test, se desconecta de la base de datos
    afterEach(async () => {
        await setup.disconnect();
    });

    describe(`POST ${settings.basePath}/titles - Crear un nuevo titulo`, () => {
        test("Deberia crear un titulo para un luchador y retornar un status 201", async () => {
            
        })
    })
})
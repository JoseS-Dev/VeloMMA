import { prisma } from "../../src/utils/prisma/prisma.js";
import { tablesToClear } from "../../src/utils/utils.js";
import request from "supertest";
import app from "../../app.js";

// Clases helpers para establecer las test de los modulos de la API
export class TestBase {
    protected readonly prisma = prisma;
    protected readonly api: ReturnType<typeof request>;
    
    constructor(){
        this.prisma = prisma;
        this.api = request(app);
    }

    // Método para limpiar la base de datos antes de cada test
    public async clearDatabase(): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw`SET CONSTRAINTS ALL DEFERRED;`;
            try{
                for (const table of tablesToClear) {
                    await tx.$executeRawUnsafe(`TRUNCATE TABLE ${table} CASCADE;`);
                }
            }
            finally{
                await tx.$executeRaw`SET CONSTRAINTS ALL IMMEDIATE;`;
            }
        });
    }

    // Método para limpiar la base de datos pero con deleteMany
    public async clearDatabaseDeleteMany(): Promise<void> {
        await this.prisma.$transaction(async (tx) => {
            try{
                for (const table of tablesToClear) {
                    const model = tx[table as keyof typeof tx] as any;
                    if (model && typeof model.deleteMany === 'function') {
                        await model.deleteMany({});
                    }
                }
            }
            catch(error){
                console.error(`Error al limpiar`, error);
            }
        });
    }

    // Método para cerrar la conexión a la base de datos después de cada test
    public async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }

    // Getter para exponer la instancia de Supertest
    public get apiInstance(): ReturnType<typeof request> {
        return this.api;
    }
}
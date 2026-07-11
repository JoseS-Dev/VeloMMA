import type { FighterSchemaDTO, FighterUpdateSchemaDTO } from './fighter.schema.js';
import type { ExtendedPrismaClient } from '../../utils/prisma/prisma.js';
import { 
    BadRequestException, 
    ConflictException, 
    NotFoundException 
} from '../../common/errors/error.js';
import { buildQueryOptions } from '../../utils/functions/function.js';

// Servicio para obtener los datos de un luchador
export class FighterService {
    constructor(private prisma: ExtendedPrismaClient) {}

    // Crear un nuevo luchador
    async create(data: FighterSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Hacemos el slug del luchador
        const slugFighter = `${data.first_name.toLowerCase()}-${data.last_name.toLowerCase()}`;
        // Se verfica que el slug no exista
        const existingFighter = await this.prisma.fighters.findUnique({
            where: {slug: slugFighter},
        });
        if(existingFighter) throw new ConflictException('El slug ya existe');
        // Si no existe, se crea el luchador
        const fighter = await this.prisma.fighters.create({
            data: {
                ...data,
                slug: slugFighter,
            }
        });
        if(!fighter) throw new BadRequestException('No se pudo crear el luchador');
        return fighter;
    }

    // Servicio para obtener todos los luchadores
    async findAll(
        cursor?: number,
        limit: number = 10,
    ){
        const queryOptions = buildQueryOptions({ cursor, limit });
        // se obtiene todos los luchadores
        const fighters = await this.prisma.fighters.findMany(queryOptions);
        // Se obtiene el proximo cursor
        const nextCursor = fighters.length > 0 ? fighters.at(-1)?.id : null;
        return {
            fighters,
            nextCursor,
            total: await this.prisma.fighters.count(),
        }
    }

    // Servicio para obtener todos los luchadores activos
    async findAllActive(
        cursor?: number,
        limit: number = 10,
    ){
        const queryOptions = buildQueryOptions({ cursor, limit, where: { is_active: true } });
        // se obtiene todos los luchadores activos
        const fighters = await this.prisma.fighters.findMany(queryOptions);
        return {
            fighters,
            total: await this.prisma.fighters.count(),
        }
    }

    // Servicio para obtener un luchador por su slug
    async findBySlug(slug: string){
        const fighter = await this.prisma.fighters.findUnique({
            where: {slug: slug},
        });
        if(!fighter) throw new NotFoundException('El luchador no existe');
        return fighter;
    }

    // Servicio para obtener un luchador por su id
    async findById(id: number){
        const fighter = await this.prisma.fighters.findUnique({
            where: {id: id},
        });
        if(!fighter) throw new NotFoundException('El luchador no existe');
        return fighter;
    }

    // Servicio para actualizar un luchador
    async update(id: number, data: FighterUpdateSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que el luchador exista
        const fighter = await this.findById(id);
        if(!fighter) throw new NotFoundException('El luchador no existe');
        // Si existe, se actualiza el luchador
        // Si se va actualizar el nombre y el apellido, se actualiza el slug
        if(data.first_name || data.last_name){
            const slugFighter = `${data?.first_name?.toLowerCase()}-${data?.last_name?.toLowerCase()}`;
            if(slugFighter !== fighter.slug){
                const existingFighter = await this.prisma.fighters.findUnique({
                    where: {slug: slugFighter},
                });
                if(existingFighter) throw new ConflictException('El slug ya existe');
                const updatedFighter = await this.prisma.fighters.update({
                    where: {id: id},
                    data: {
                        ...data,
                        slug: slugFighter,
                    }
                });
                if(!updatedFighter) throw new BadRequestException('No se pudo actualizar el luchador');
                return updatedFighter;
            }
        }
        const updatedFighter = await this.prisma.fighters.update({
            where: {id: id},
            data: data
        });
        if(!updatedFighter) throw new BadRequestException('No se pudo actualizar el luchador');
        return updatedFighter;
    }

    // Servicio para cambiar el estado de un luchador
    async changeStatus(id: number, status: boolean){
        if(!id) throw new BadRequestException('El id es obligatorio');
        if(typeof status !== 'boolean') throw new BadRequestException('El estado es obligatorio');
        // Se verifica que el luchador exista
        const fighter = await this.findById(id);
        if(!fighter) throw new NotFoundException('El luchador no existe');
        // Si existe, se actualiza el luchador
        const updatedFighter = await this.prisma.fighters.update({
            where: {id: id},
            data: {
                is_active: status,
            }
        });
        if(!updatedFighter) throw new BadRequestException('No se pudo actualizar el luchador');
        return updatedFighter;
    }

    // Servicio para eliminar un luchador (Opcional)
    async delete(id: number){
        // Se verifica que el luchador exista
        const fighter = await this.findById(id);
        if(!fighter) throw new NotFoundException('El luchador no existe');
        // Si existe, se elimina el luchador
        const deletedFighter = await this.prisma.fighters.update({
            where: {id: id},
            data: {deleted_at: new Date()}
        });
        if(!deletedFighter) throw new BadRequestException('No se pudo eliminar el luchador');
        return deletedFighter;
    }
}
import type { TitleSchemaDTO, UpdateTitleSchemaDTO } from "./title.schema.js";
import type { ExtendedPrismaClient } from "../../../utils/prisma/prisma.js";
import { TitleType } from "../../../../generated/prisma/index.js";
import { BadRequestException, NotFoundException } from "../../../common/errors/error.js";
import { buildQueryOptions } from "../../../utils/functions/function.js";

// Servicio para interactuar con la tabla fighterTitles de la base de datos
export class TitleService {
    constructor(private readonly prisma: ExtendedPrismaClient) {}

    // Servicio para crear un nuevo titulo de un luchador en una división
    async create(data: TitleSchemaDTO){
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el luchador y la división
        const [existingFighter, existingDivision] = await Promise.all([
            this.prisma.fighters.findUnique({
                where: { id: data.fighter_id }
            }),
            this.prisma.divisions.findUnique({
                where: { id: data.division_id }
            })
        ]);
        if(!existingFighter) throw new NotFoundException('El luchador no existe');
        if(!existingDivision) throw new NotFoundException('La división no existe');
        // Si todo esta bien, se crea el titulo
        const title = await this.prisma.fighterTitles.create({
            data: data
        });
        if(!title) throw new BadRequestException('No se pudo crear el titulo');
        return title;
    }

    // Servicio para obtener todos los titulos de un luchador
    async findAllByFighter(
        fighterId: number,
        cursor?: number,
        limit: number = 10
    ){
        if(!fighterId) throw new BadRequestException('El id del luchador es obligatorio');
        // Se verifica que exista el luchador
        const existingFighter = await this.prisma.fighters.findUnique({
            where: { id: fighterId }
        });
        if(!existingFighter) throw new NotFoundException('El luchador no existe');
        // Se obtienen los titulos del luchador
        const queryOptions = buildQueryOptions({ cursor, limit, where: { fighter_id: fighterId } });
        // Se cuenta el total de titulos del luchador
        const total = await this.prisma.fighterTitles.count({
            where: { fighter_id: fighterId }
        });
        // Se obtienen los titulos del luchador
        const titles = await this.prisma.fighterTitles.findMany(queryOptions);
        return {
            titles,
            total
        }
    }

    // Servicio para obtener el registro de todos los campeones de una división
    async findAllByDivision(
        divisionId: number,
        cursor?: number,
        limit: number = 10
    ){
        if(!divisionId) throw new BadRequestException('El id de la división es obligatorio');
        // Se verifica que exista la división
        const existingDivision = await this.prisma.divisions.findUnique({
            where: { id: divisionId }
        });
        if(!existingDivision) throw new NotFoundException('La división no existe');
        // Se obtienen los titulos de la división
        const queryOptions = buildQueryOptions({ cursor, limit, where: { division_id: divisionId } });
        // Se cuenta el total de titulos de la división
        const total = await this.prisma.fighterTitles.count({
            where: { division_id: divisionId }
        });
        // Se obtienen los titulos de la división
        const titles = await this.prisma.fighterTitles.findMany(queryOptions);
        return {
            titles,
            total
        };
    }

    // Servicio para obtener todos los campiones de una división dependiendo del tipo del titulo
    async findAllByDivisionAndTitleType(
        divisionId: number,
        titleType: TitleType,
        cursor?: number,
        limit: number = 10
    ){
        if(!divisionId) throw new BadRequestException('El id de la división es obligatorio');
        if(!titleType) throw new BadRequestException('El tipo de titulo es obligatorio');
        // Se verifica que exista la división
        const existingDivision = await this.prisma.divisions.findUnique({
            where: { id: divisionId }
        });
        if(!existingDivision) throw new NotFoundException('La división no existe');
        // Se obtienen los titulos de la división y tipo de titulo
        const queryOptions = buildQueryOptions({ cursor, limit, where: { division_id: divisionId, title_type: titleType } });
        // Se cuenta el total de titulos de la división y tipo de titulo
        const total = await this.prisma.fighterTitles.count({
            where: { division_id: divisionId, title_type: titleType }
        });
        // Se obtienen los titulos de la división y tipo de titulo
        const titles = await this.prisma.fighterTitles.findMany(queryOptions);
        return {
            titles,
            total
        };
    }

    // Servicio para obtener un titulo por su ID
    async findById(titleId: number){
        if(!titleId) throw new BadRequestException('El id del titulo es obligatorio');
        // Se obtiene el titulo por su ID
        const title = await this.prisma.fighterTitles.findUnique({
            where: { id: titleId }
        });
        if(!title) throw new NotFoundException('El titulo no existe');
        return title;
    }

    // Servicio para actualizar un titulo por su ID
    async update(titleId: number, data: UpdateTitleSchemaDTO){
        if(!titleId) throw new BadRequestException('El id del titulo es obligatorio');
        if(!data) throw new BadRequestException('Los datos son obligatorios');
        // Se verifica que exista el titulo
        const existingTitle = await this.findById(titleId);
        if(!existingTitle) throw new NotFoundException('El titulo no existe');
        // Se actualiza el titulo
        const updatedTitle = await this.prisma.fighterTitles.update({
            where: { id: titleId },
            data: data
        });
        if(!updatedTitle) throw new BadRequestException('No se pudo actualizar el titulo');
        return updatedTitle;
    }

    // Servicio para eliminar un titulo por su ID
    async delete(titleId: number){
        if(!titleId) throw new BadRequestException('El id del titulo es obligatorio');
        // Se verifica que exista el titulo
        const existingTitle = await this.findById(titleId);
        if(!existingTitle) throw new NotFoundException('El titulo no existe');
        // Se elimina el titulo
        const deletedTitle = await this.prisma.fighterTitles.update({
            where: { id: titleId },
            data: { deleted_at: new Date() }
        });
        if(!deletedTitle) throw new BadRequestException('No se pudo eliminar el titulo');
        return deletedTitle;
    }

}
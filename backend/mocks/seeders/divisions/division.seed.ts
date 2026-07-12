import { DIVISIONS_DATA } from '../../../src/utils/constants/constant.js';
import type { ExtendedPrismaClient } from '../../../src/utils/prisma/prisma.js';
import {faker} from '@faker-js/faker';

export async function seedDivisions(prisma: ExtendedPrismaClient) {
  console.log('   📊 Creando divisiones...');
  const createdDivisions = [];
  
  for (const division of DIVISIONS_DATA) {
    try {
      // Primero verificar si existe
      const existing = await prisma.divisions.findFirst({
        where: {
          name_division: division.name_division,
          weight_class: division.weight_class,
          gender: division.gender,
        },
      });

      let result;
      if (existing) {
        // Actualizar si existe
        result = await prisma.divisions.update({
          where: { id: existing.id },
          data: {
            is_active: true,
            updated_at: new Date(),
          },
        });
        console.log(`   ✅ División actualizada: ${division.name_division}`);
      } else {
        // Crear si no existe
        result = await prisma.divisions.create({
          data: {
            ...division,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        console.log(`   ✅ División creada: ${division.name_division}`);
      }
      
      createdDivisions.push(result);
    } catch (error) {
      console.error(`   ❌ Error con división ${division.name_division}:`, error);
    }
  }
  
  console.log(`   ✅ ${createdDivisions.length} divisiones procesadas`);
  return createdDivisions;
}
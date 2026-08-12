import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
    // Limpa antes de popular de novo, pra poder rodar o seed várias vezes
    await prisma.feedbackNote.deleteMany();
    await prisma.feedback.deleteMany();

    const [
        anaPaula,
        carlosEduardo,
        mariana,
        roberto,
        fernanda,
        juliana,
        pedroHenrique,
        beatriz,
        lucas,
        camila,
        thiago,
        patricia,
    ] = await Promise.all([
        prisma.feedback.create({
            data: {
                customerName: 'Ana Paula Ferreira',
                rating: 5,
                comment: 'Atendimento excelente e comida deliciosa!',
                channel: 'GOOGLE',
                status: 'CONCLUIDO',
                createdAt: new Date('2026-07-15T12:30:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Carlos Eduardo Souza',
                rating: 2,
                comment: 'Pedido chegou frio e bem atrasado.',
                channel: 'IFOOD',
                status: 'EM_ANALISE',
                createdAt: new Date('2026-07-18T19:10:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Mariana Costa',
                rating: 4,
                comment: 'Gostei bastante, só achei o preço um pouco salgado.',
                channel: 'PESQUISA',
                status: 'NOVO',
                createdAt: new Date('2026-07-20T09:45:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Roberto Lima',
                rating: 1,
                comment: 'Comida sem sal e atendimento péssimo.',
                channel: 'GOOGLE',
                status: 'EM_ANALISE',
                createdAt: new Date('2026-07-22T13:20:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Fernanda Alves',
                rating: 5,
                comment: null,
                channel: 'IFOOD',
                status: 'CONCLUIDO',
                createdAt: new Date('2026-07-25T20:05:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Juliana Martins',
                rating: 3,
                comment: 'Achei mediano, nada de especial.',
                channel: 'PESQUISA',
                status: 'NOVO',
                createdAt: new Date('2026-07-28T11:15:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Pedro Henrique',
                rating: 2,
                comment: 'Demora excessiva pra ser atendido.',
                channel: 'GOOGLE',
                status: 'CONCLUIDO',
                createdAt: new Date('2026-07-30T18:40:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Beatriz Santos',
                rating: 4,
                comment: 'Muito bom, só demorou um pouco.',
                channel: 'IFOOD',
                status: 'EM_ANALISE',
                createdAt: new Date('2026-08-01T21:00:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Lucas Oliveira',
                rating: 5,
                comment: 'Melhor restaurante da região!',
                channel: 'PESQUISA',
                status: 'CONCLUIDO',
                createdAt: new Date('2026-08-03T10:30:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Camila Rodrigues',
                rating: 1,
                comment: 'Encontrei um cabelo na comida.',
                channel: 'GOOGLE',
                status: 'NOVO',
                createdAt: new Date('2026-08-05T14:50:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Thiago Barbosa',
                rating: 3,
                comment: null,
                channel: 'IFOOD',
                status: 'NOVO',
                createdAt: new Date('2026-08-07T19:25:00'),
            },
        }),
        prisma.feedback.create({
            data: {
                customerName: 'Patrícia Gomes',
                rating: 4,
                comment: 'Ambiente agradável, recomendo.',
                channel: 'PESQUISA',
                status: 'EM_ANALISE',
                createdAt: new Date('2026-08-09T16:10:00'),
            },
        }),
    ]);

    await prisma.feedbackNote.createMany({
        data: [
            {
                feedbackId: anaPaula.id,
                description: 'Enviamos agradecimento ao cliente pelo feedback positivo.',
                createdAt: new Date('2026-07-15T15:00:00'),
            },
            {
                // Crítico (nota 1) que JÁ TEM anotação -> pode ser marcado como CONCLUIDO
                feedbackId: roberto.id,
                description: 'Entramos em contato com o cliente e oferecemos um voucher de desconto.',
                createdAt: new Date('2026-07-23T09:00:00'),
            },
            {
                // Crítico (nota 2) já concluído -> a anotação é o motivo de ter sido permitido
                feedbackId: pedroHenrique.id,
                description: 'Problema de demora registrado e repassado para a equipe de sala.',
                createdAt: new Date('2026-07-31T08:30:00'),
            },
        ],
    });

    console.log('Seed concluído: 12 feedbacks e 3 anotações criados.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
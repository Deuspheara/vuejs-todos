'use strict'

import { Tasks } from '../../database.js';



export default async function(fastify, opts) {
    //return all the tasks
    fastify.get('/', async function(request, reply) {
        if (request.query !== undefined) {
            if (request.query.name !== undefined)
                return Tasks.findAll({ where: { name: request.query.name } })
        }
        return Tasks.findAll();
    })

    //return the tasks associated to the id
    fastify.get('/:id', async function(request, reply) {
        return Tasks.findAll({ where: { id: request.params.id } })
    })

    // create a task with default state at false
    fastify.post('/', async function(request, reply) {
        if (!request.body)
            return reply.code(400).send({ error: 'must have a body' })

        if (request.body.name === "" || request.body.name === undefined)
            return reply.code(400).send({ error: 'body must have a name' })

        return Tasks.create({ name: request.body.name, state: false });
    })

    //modify a tasks
    fastify.put('/', async function(request, reply) {
        let tasks;
        if (!request.body)
            return reply.code(400).send({ error: 'must have a body' })

        if (request.body.id === undefined) {
            return reply.code(400).send({ error: 'body must have an id' })
        }
        if ((request.body.newName !== undefined)) {
            tasks = await Tasks.update({
                name: request.body.newName
            }, {
                where: { id: request.body.id }
            })
        }
        if ((request.body.newState !== undefined)) {
            tasks = await Tasks.update({
                state: request.body.newState
            }, {
                where: { id: request.body.id }
            })
        }
        if (request.body.delete !== undefined)
            return Tasks.destroy({ where: { id: request.body.delete } })

    })

    //return the stats of tasks
    fastify.get('/stats', async function(request, reply) {
        let p;
        const c = await Tasks.count({
            where: {
                state: true
            }
        });
        const n = await Tasks.count();
        if (n != 0)
            p = (c * 100) / n;
        else
            p = 0
        return {
            nbTasks: n,
            nbTasksDone: c,
            taskPourcent: p
        }
    })

}
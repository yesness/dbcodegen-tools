import { D, DBCodegenConfig, SELF_LOCAL_TABLE_ID, T } from '@yesness/dbcodegen';

export const config: DBCodegenConfig = {
    charset: 'utf8',
    collate: 'utf8_general_ci',
};

const ID = {
    self: SELF_LOCAL_TABLE_ID,
};

export const Major = D.schema('major')
    .autoID()
    .fields({
        name: T.string().length(256),
    })
    .with(D.field('data', T.binary()).nullable());

export const Professor = D.schema('professor')
    .autoID()
    .fields({
        name: T.string().length(256),
    })
    .with(
        D.field('data', T.binary()).nullable().noLoad(),
        D.edge(Major).id('major').onUpdate('cascade')
    )
    .queries(
        D.query('', {
            join: {
                a: D.join(ID.self, 'major'),
            },
        }).select({
            multiResult: true,
            localTableIDs: [ID.self, 'a'],
        }),
        D.query('ByName', { where: [D.where(ID.self, 'name')] }).select()
    );

export const Class = D.schema('class')
    .autoID()
    .fields({
        name: T.string().length(256),
        duration: T.int(),
    })
    .with(D.edge(Professor).id('professor'));

export const Assignment = D.schema('assignment')
    .autoID()
    .with(
        D.field('name', T.string().length(256)).setDefault('super assignment'),
        D.edge(Class).id('class')
    )
    .queries(
        D.query('ByIDAndName', {
            where: [D.where(ID.self, 'id'), D.where(ID.self, 'name')],
        })
            .delete()
            .update()
            .select({
                multiResult: 'both',
            }),
        D.query('ByIDWithName', {
            where: [
                D.where(ID.self, 'id'),
                D.where(ID.self, 'name', { value: 'bob' }),
            ],
        }).select(),
        D.query('ByIDWithNullName', {
            where: [
                D.where(ID.self, 'id'),
                D.where(ID.self, 'name', { value: null }),
            ],
        }).select(),
        D.query('ByClassName', {
            join: {
                a: D.join(ID.self, 'class'),
            },
            where: [D.where('a', 'name')],
        })
            .delete()
            .update(),
        D.query('ByProfessorName', {
            join: {
                a: D.join(ID.self, 'class'),
                b: D.join('a', 'professor'),
            },
            where: [D.where('b', 'name')],
        }).delete(),
        D.query('ClassByAssignmentName', {
            join: {
                a: D.join(ID.self, 'class'),
            },
            where: [
                D.where(ID.self, 'name', {
                    key: 'assignmentName',
                }),
            ],
        }).select({
            multiResult: 'both',
            localTableIDs: ['a'],
        }),
        D.query('ByName', {
            join: {
                a: D.join(ID.self, 'class').left(),
            },
            where: [D.where(ID.self, 'name')],
        }).select({
            localTableIDs: [ID.self, 'a'],
        }),
        D.query('ByNameAndName', {
            join: {
                a: D.join(ID.self, 'class').left(),
            },
            where: [D.where(ID.self, 'name'), D.where(ID.self, 'name')],
        }).select({
            localTableIDs: [ID.self, 'a'],
        })
    );

export const Student = D.schema('student')
    .autoID()
    .fields({
        name: T.string().length(256),
        hasFun: T.boolean(),
    })
    .with(
        D.field('isHappy', T.boolean()).nullable(),
        D.field('email', T.string()),
        D.edge(Major),
        D.edge(Class).name('FavoriteClass').nullable()
    );

export const StudentToClass = D.schema('studentToClass')
    .id('studentToClass')
    .index('primary', D.edge(Student).id('student'), D.edge(Class).id('class'))
    .fields({ score: T.int() })
    .queries(
        D.query('ByClassID', {
            where: [D.where(ID.self, 'class')],
        }).select()
    );

export const Foo = D.schema('foo')
    .autoID()
    .fields({
        bar: T.int(),
    })
    .with(D.edge(Student).id('student'))
    .queries(
        D.query('ClassesByFooBar', {
            join: {
                stc: D.join(ID.self, 'student', 'studentToClass', 'student'),
                c: D.join('stc', 'class'),
            },
            where: [D.where(ID.self, 'bar')],
        }).select({
            multiResult: true,
            localTableIDs: ['c'],
            orderBy: {
                id: 'bar',
            },
        }),
        D.query('TestCustom', {
            where: [
                D.where(ID.self, 'bar', {
                    custom: 'IS NOT NULL',
                }),
            ],
        }).select()
    );

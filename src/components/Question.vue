<template>
    <div class="wrap">
        <div class="parent" v-if="subtree.criteria.length > 1">based on: {{ subtree.name }}</div>
        <div class="div" v-for="i in subtree.criteria" :key="i.id">
            <div class="div" v-for="j in subtree.criteria" :key="j.id">
                <div class="row" v-if="subtree.criteria.indexOf(j) > subtree.criteria.indexOf(i)">
                    <div class="alt">{{ i.name }}</div>
                    <input
                        type="text"
                        class="alt number"
                        @change="refresh(
                            subtree,
                            subtree.criteria.indexOf(i),
                            subtree.criteria.indexOf(j),
                            $event
                        )"
                        v-model.number="subtree.matrix[
                            subtree.criteria.indexOf(i)
                            * subtree.criteria.length
                            + subtree.criteria.indexOf(j)
                        ].value"
                        placeholder="0"
                    >
                    <div class="alt">{{ j.name }}</div>
                </div>
            </div>
        </div>

        <div v-if="subtree !== null">
            <div v-for="criterion in subtree.criteria" :key="criterion.id">
                <question
                    :subtree="criterion"
                    :initial-criterion="criterion.name"
                    :key="criterion.id"
                ></question>
            </div>
        </div>
    </div>
</template>

<script>
    import eventHub from '../eventHub'

    export default {
        name: 'Question',
        props: ['subtree', 'initialCriterion'],
        methods: {
            refresh(subtree, i, j, event) {
                subtree.matrix[j * subtree.criteria.length + i].value = parseFloat(1 / event.target.value)

                eventHub.$emit('update')
            },
        },
    }
</script>

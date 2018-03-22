<template>
    <div class="wrap">
        <div class="parent" v-if="subtree.criteria.length > 1">based on: {{ subtree.name }}</div>
        <div class="div" v-for="i in subtree.criteria" :key="i.name">
            <div class="div" v-for="j in subtree.criteria" :key="j.name">
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
            <div v-for="criterion in subtree.criteria" :key="criterion.name">
                <question
                    :subtree="criterion"
                    :initial-criterion="criterion.name"
                    :key="criterion.name"
                ></question>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Question',
        props: ['subtree', 'initialCriterion'],
        methods: {
            refresh(subtree, i, j, event) {
                subtree.matrix[j * subtree.criteria.length + i].value = parseFloat(1 / event.target.value)

                this.$root.$forceUpdate()
            },
        },
    }
</script>

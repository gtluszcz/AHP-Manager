<template>
    <div class="wrap">
        <div v-if="subtree.criteria.length == 0">
            <div class="parent" v-if="alternatives.length > 1">based on: {{ subtree.name }}</div>
            <div class="div" v-for="i in alternatives" :key="i.name">
                <div class="div" v-for="j in alternatives" :key="j.name">
                    <div
                        class="row"
                        v-if="alternatives.indexOf(j) > alternatives.indexOf(i)"
                    >
                        <div class="alt">{{ i.value }}</div>
                        <input
                            type="text"
                            class="alt number"
                            @change="refresh(
                                subtree,
                                alternatives.indexOf(i),
                                alternatives.indexOf(j),
                                $event
                            )"
                            v-model.number="subtree.matrix[
                                alternatives.indexOf(i)
                                * alternatives.length
                                + alternatives.indexOf(j)
                            ].value"
                            placeholder="0"
                        >
                        <div class="alt">{{ j.value }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="subtree !== null">
            <div v-for="criterion in subtree.criteria" :key="criterion.name">
                <question2
                    :subtree="criterion"
                    :initial-criterion="criterion.name"
                    :alternatives="alternatives"
                    :key="criterion.name"
                ></question2>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Question2',
        props: ['subtree', 'initialCriterion', 'alternatives'],
        methods: {
            refresh(subtree, i, j, event) {
                subtree.matrix[j * this.$root.alternatives.length + i].value = parseFloat(1 / event.target.value)

                this.$root.$forceUpdate()
            },
        },
    }
</script>

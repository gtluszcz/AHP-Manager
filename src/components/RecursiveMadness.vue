<template>
    <div class="level">
        <div class="row">
            <input type="text" class="cell" v-model="criterion" @blur="onBlur" placeholder="Enter subcriteria">
            <div class="buttons">
                <button
                    class="left"
                    @click="subtract()"
                    v-if="subtree.criteria !== null && this.$parent.subtree != null"
                >-</button>
                <button
                    class="right"
                    :class="{ round: this.$parent.subtree == null }"
                    @click="add"
                    v-if="subtree.criteria !== null"
                >+</button>
            </div>
        </div>

        <div v-if="subtree !== null">
            <div v-for="criterion in subtree.criteria" :key="criterion.id">
                <recursive-madness
                    :subtree="criterion"
                    :initial-criterion="criterion.name"
                    :key="criterion.id"
                ></recursive-madness>
            </div>
        </div>
    </div>
</template>

<script>
    import eventHub from '../eventHub'

    export default {
        name: 'RecursiveMadness',
        props: ['subtree', 'initialCriterion'],
        data() {
            return {
                criterion: this.initialCriterion,
            }
        },
        methods: {
            add() {
                this.subtree.criteria.push({
                    name: '',
                    matrix: [],
                    criteria: [],
                    id: Math.random(),
                })

                this.setMatrix()
                this.$root.setLastMatrixes(this.$root.tree)
                eventHub.$emit('update')
            },
            subtract() {
                this.$parent.subtree.criteria.splice(this.$parent.subtree.criteria.indexOf(this.subtree), 1)
                this.setParentMatrix()
                eventHub.$emit('update')
            },
            setMatrix() {
                this.subtree.matrix = []

                const n = this.subtree.criteria.length

                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        this.subtree.matrix[i * n + j] = (i === j) ? { value: 1 } : { value: 0 }
                    }
                }
            },
            setParentMatrix() {
                this.$parent.subtree.matrix = []

                const n = this.$parent.subtree.criteria.length

                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        this.$parent.subtree.matrix[i * n + j] = (i === j) ? { value: 1 } : { value: 0 }
                    }
                }
            },
            onBlur() {
                this.subtree.name = this.criterion
                eventHub.$emit('update')
            },
        },
    }
</script>

<style>

</style>

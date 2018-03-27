import Numeric from 'Numeric'
import Maths from './Maths'

class MeanMethod extends Maths {
    static priorityVector(node) {
        if (node.criteria.length === 0) {
            return this._mean(node.matrix)
        }

        const compareVector = this._mean(node.matrix)

        let vector = 0
        let counter = 0

        for (let el of compareVector) {
            vector = Numeric.add(vector, Numeric.mul(el, this.priorityVector(node.criteria[counter])))
            counter++
        }

        return vector
    }

    static _mean(A) {
        const matrix = A.map(el => el.value)
        const vector = []
        const n = Math.sqrt(matrix.length)

        for (let i = 0; i < n; i++) {
            vector[i] = 1

            for (let j = 0; j < n; j++) {
                vector[i] *= matrix[i * n + j]
            }

            vector[i] = Math.pow(vector[i], 1 / n)
        }


        return vector.map(el => el / Numeric.sum(vector))
    }
}

export default MeanMethod

import Numeric from 'Numeric'
import MathMethod from './MathMethod'

class MeanMethod extends MathMethod {
    static _calculate(A) {
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

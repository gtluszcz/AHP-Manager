import Numeric from 'Numeric'
import Maths from './Maths'

class EigenvectorMethod extends Maths {
    static priorityVector(node) {
        if (node.criteria.length === 0) {
            return this._eigenvector(node.matrix)
        }

        const compareVector = this._eigenvector(node.matrix)

        let vector = 0
        let counter = 0

        for (let el of compareVector) {
            vector = Numeric.add(vector, Numeric.mul(el, this.priorityVector(node.criteria[counter])))
            counter++
        }

        return vector
    }

    static _eigenvector(A) {
        const result = Numeric.eig(this.convert2dMatrixTo3d(A.map(el => el.value)))

        // if (typeof result.E.y !== 'undefined' || typeof result.lambda.y !== 'undefined' ) {
        //     throw 'Complex eigenvalues and eigenvectors are not supported yet'
        // }

        let maxLambdaIndex = 0

        for (let i = 0; i < result.lambda.x.length; i++) {
            if (result.lambda.x[i] > result.lambda.x[maxLambdaIndex]) {
                maxLambdaIndex = i
            }
        }

        let transpose = result.E.x[0].map((x, i) => result.E.x.map(x => x[i]))

        let vector = transpose[maxLambdaIndex]

        return vector.map(el => el / Numeric.sum(vector))
    }
}

export default EigenvectorMethod

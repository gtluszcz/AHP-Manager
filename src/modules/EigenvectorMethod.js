import Numeric from 'Numeric'
import MathMethod from './MathMethod'

class EigenvectorMethod extends MathMethod {
    static _calculate(A) {
        const result = Numeric.eig(this.convert2dMatrixTo3d(A.map(el => el.value)))

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

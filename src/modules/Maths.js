import Numeric from 'Numeric'

class Maths {
    static convert2dMatrixTo3d(matrix2d) {
        const matrix3d = []
        const n = Math.sqrt(matrix2d.length)

        for (let i = 0; i < n; i++) {
            matrix3d[i] = []
            for (let j = 0; j < n; j++) {
                matrix3d[i][j] = matrix2d[i * n + j]
            }
        }

        return matrix3d
    }

    static eigenvector(A) {
        const result = Numeric.eig(Maths.convert2dMatrixTo3d(A.map(el => el.value)))



        if (typeof result.E.y !== 'undefined' || typeof result.lambda.y !== 'undefined' ) {

            throw 'Complex eigenvalues and eigenvectors are not supported yet'
        }

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



    static nodeVector(node){
        if(node.criteria.length==0) {
            console.log(node.name, Maths.eigenvector(node.matrix))
            return Maths.eigenvector(node.matrix)
        }

        const compareVector = Maths.eigenvector(node.matrix)
        console.log(node.name,compareVector)
        let vector = 0
        let counter = 0
        for(let el of compareVector){

            vector=Numeric.add(vector,Numeric.mul(el,Maths.nodeVector(node.criteria[counter])))
            counter++

        }
        return vector
    }
}

export default Maths

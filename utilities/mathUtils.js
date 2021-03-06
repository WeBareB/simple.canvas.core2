var mathUtils = {
    getCurvePoints ({ start, end, midPoints, startMethod = 'out', endMethod = 'in', midPointsDefaultMethod = 'inOut', type = 'quad' }) {
        let direction = start.direction(end);
        let angle =  direction.angleTo(V2.right);

        let endRotated = end.substract(start).rotate(angle).add(start)

        let distance = start.distance(endRotated);
        let dv = start.direction(endRotated).mul(distance);

        let dots = [];
        for(let i = 0; i <= midPoints.length;i++){
            let length = 0
            let startValue = 0;
            let endValue = 0;
            //let type = 'quad';
            let method = '';
            let startX = 0;

            if(i == 0){
                startX = start.x;
                length = fast.r(distance*midPoints[0].distance);
                startValue = start.y;
                endValue = startValue+midPoints[0].yChange;
                method = startMethod
            }
            else if(i == midPoints.length){
                length = fast.r(distance - distance*midPoints[midPoints.length-1].distance);
                startX = endRotated.x - length;
                startValue = start.y+midPoints[midPoints.length-1].yChange;
                endValue = start.y;
                method = endMethod
            }
            else {
                startX = fast.r(start.x + distance*midPoints[i-1].distance);
                length = fast.r(distance*midPoints[i].distance - distance*midPoints[i-1].distance);
                startValue = start.y+midPoints[i-1].yChange;
                endValue = start.y+midPoints[i].yChange;
                method = midPointsDefaultMethod
            }

            let yChange = easing.createProps(length, startValue, endValue, type, method);

            for(let i = 0; i < length; i++){
                yChange.time = i;
                let y = easing.process(yChange);
                let x = startX + i;
                let dot = new V2(x,y).substract(start).rotate(-angle).add(start);
                dots.push(dot);
            }
        }

        return dots;
    },
    //https://rosettacode.org/wiki/Reduced_row_echelon_form#JavaScript
    reducedRowEchelonForm: function(mat) {
      let lead = 0;
      for (let r = 0; r < mat.length; r++) {
          if (mat[0].length <= lead) {
              return;
          }
          let i = r;
          while (mat[i][lead] == 0) {
              i++;
              if (mat.length == i) {
                  i = r;
                  lead++;
                  if (mat[0].length == lead) {
                      return;
                  }
              }
          }
   
          let tmp = mat[i];
          mat[i] = mat[r];
          mat[r] = tmp;
   
          let val = mat[r][lead];
          for (let j = 0; j < mat[0].length; j++) {
              mat[r][j] /= val;
          }
   
          for (let i = 0; i < mat.length; i++) {
              if (i == r) continue;
              val = mat[i][lead]
              for (let j = 0; j < mat[0].length; j++) {
                  mat[i][j] -=  val*mat[r][j]
              }
          }
          lead++;
      }
      return mat;
    },
    //https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/cubic-spline-interpolation.js
    cubicSplineInterpolation(p, boundary = '') {
      let row = 0;
      let solutionIndex = (p.length - 1) * 4;
  
      // initialize matrix
      let m = []; // rows
      for (let i = 0; i < (p.length - 1) * 4; i++) {
          // columns (rows + 1)
          m.push([]);
          for (let j = 0; j <= (p.length - 1) * 4; j++) {
              m[i].push(0); // fill with zeros
          }
      }
  
      // splines through p equations
      for (let functionNr = 0; functionNr < p.length-1; functionNr++, row++) {
          let p0 = p[functionNr], p1 = p[functionNr+1];
          m[row][functionNr*4+0] = Math.pow(p0.x, 3);
          m[row][functionNr*4+1] = Math.pow(p0.x, 2); 
          m[row][functionNr*4+2] = p0.x;
          m[row][functionNr*4+3] = 1; 
          m[row][solutionIndex] = p0.y;
  
          m[++row][functionNr*4+0] = Math.pow(p1.x, 3);
          m[row][functionNr*4+1] = Math.pow(p1.x, 2); 
          m[row][functionNr*4+2] = p1.x;
          m[row][functionNr*4+3] = 1; 
          m[row][solutionIndex] = p1.y;
      }
  
      // first derivative
      for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
          let p1 = p[functionNr+1];
          m[row][functionNr*4+0] = 3*Math.pow(p1.x, 2);
          m[row][functionNr*4+1] = 2*p1.x;
          m[row][functionNr*4+2] = 1;
          m[row][functionNr*4+4] = -3*Math.pow(p1.x, 2);
          m[row][functionNr*4+5] = -2*p1.x;
          m[row][functionNr*4+6] = -1;
      }
  
      // second derivative
      for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
          let p1 = p[functionNr+1];
          m[row][functionNr*4+0] = 6* p1.x;
          m[row][functionNr*4+1] = 2;
          m[row][functionNr*4+4] = -6*p1.x;
          m[row][functionNr*4+5] = -2;
      }
  
      // boundary conditions
      switch (boundary) {
          case "quadratic": // first and last spline quadratic
              m[row++][0] = 1;
              m[row++][solutionIndex-4+0] = 1;
              break;
  
          case "notaknot": // Not-a-knot spline
              m[row][0+0] = 1;
              m[row++][0+4] = -1;
              m[row][solutionIndex-8+0] = 1;
              m[row][solutionIndex-4+0] = -1;
              break;
  
          case "periodic": // periodic function
              // first derivative of first and last point equal
              m[row][0] = 3* Math.pow(p[0].x, 2);
              m[row][1] = 2* p[0].x;
              m[row][2] = 1;
              m[row][solutionIndex-4+0] = -3* Math.pow(p[p.length-1].x, 2);
              m[row][solutionIndex-4+1] = -2* p[p.length-1].x;
              m[row++][solutionIndex-4+2] = -1;
  
              // second derivative of first and last point equal
              m[row][0] = 6* p[0].x;
              m[row][1] = 2;
              m[row][solutionIndex-4+0] = -6* p[p.length-1].x;
              m[row][solutionIndex-4+1] = -2;
              break;
  
          default: // natural spline
              m[row][0+0] = 6* p[0].x;
              m[row++][0+1] = 2;
              m[row][solutionIndex-4+0] = 6* p[p.length-1].x;
              m[row][solutionIndex-4+1] = 2;
              break;
      }
  
  
      let reducedRowEchelonForm = this.reducedRowEchelonForm(m);
      let coefficients = [];
      for (let i = 0; i < reducedRowEchelonForm.length; i++) {
          coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
      }
  
      let functions = [];
      for (let i = 0; i < coefficients.length; i += 4) {
          functions.push({
              a: parseFloat(coefficients[i]),
              b: parseFloat(coefficients[i+1]),
              c: parseFloat(coefficients[i+2]),
              d: parseFloat(coefficients[i+3]),
              range: { xmin: parseFloat(p[i/4].x), xmax: parseFloat(p[i/4+1].x) }
          })
      }
      return functions;
    },
    //https://github.com/Simsso/Online-Tools/blob/master/src/page/logic/polynomial-interpolation.js
    polynomialInterpolation(p) {
      let m = []; // matrix
      let numPoints = p.length; // number of points
  
      // fill matrix
      for (let row = 0; row < numPoints; row++) {
          m.push([]);
  
          // "<="" because of the solution column
          for (let col = 0; col <= numPoints; col++) {
              if (col < numPoints) { // coefficients
                  m[row][col] = Math.pow(p[row].x, numPoints - col - 1);
              }
              else { // solution
                  m[row][col] = p[row].y;
              }
          }
      }
  
      let reducedRowEchelonForm = this.reducedRowEchelonForm(m);
      let coefficients = [];
      for (let i = 0; i < reducedRowEchelonForm.length; i++) {
          coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
      }
      return coefficients;
    },
    getPolinomFormula(dots) {
        let coefficients = this.polynomialInterpolation(dots);
        return (x)  => {
            let y = 0; 
            for (let i = 0; i < coefficients.length; i++) {
                let c = coefficients[i];
                y += c * Math.pow(x, coefficients.length - i - 1);
            }
            return y;
        }
    },
    getCubicSplineFormula(dots) {
        let functions = this.cubicSplineInterpolation(dots);
        return (x) => {
            for (var i = 0; i < functions.length; i++) {
                if (functions[i].range.xmin <= x && functions[i].range.xmax >= x) {
                    return functions[i].a * x * x * x + functions[i].b * x * x + functions[i].c * x + functions[i].d;
                }
            }
            return undefined;
        }
    }
  }
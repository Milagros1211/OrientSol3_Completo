function  RhBetaTotal = RhBeta(numeroN2,Gh_matriz,COEF)

    %Creamos una matriz con las inclinaciones posibles, de 0º a 90º con
    %incremento de 1º

    inclinaciones = zeros(1,91);
    n = 0;
   for m=1:91
        
        n = n + ((1*2*pi)/360);
        inclinaciones(m)= n;
   end
    
    %En la matriz "RhBetaTotal" se almacenan los valores horarios de la
    %radiación reflejada o de albedo para las distintas inclinaciones
    
    %RhBetaTotal = zeros(91,12,numeroN2(j,i))
    
    r = COEF;
    
    for i=1:12
        for j=1:91
            for k=1:numeroN2(i,j)
                
               RhBetaTotal(i,j,k) = (Gh_matriz(i,k) /2) * (1 - cos(inclinaciones (j)))* r;
               
            end
        end
    end
    
    
end
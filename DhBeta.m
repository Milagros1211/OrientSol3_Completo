function DhBetaTotal = DhBeta(numeroN2,Dh_matriz)

    %Creamos una matriz con las inclinaciones posibles, de 0º a 90º con
    %incremento de 1º

    inclinaciones = zeros(1,91);
    n = 0;
    
    for m=1:91
        
        n = n + ((1*2*pi)/360);
        inclinaciones(m)= n;
    end
   
    
    %En la matriz "DhBetaTotal" se almacenan los valores horarios de la
    %radiación difusa para las distintas inclinaciones
    
    %DhBetaTotal = zeros(91,12,numeroN2(j,i))
    
    for i=1:12
        for j=1:91
            for k=1:numeroN2(i,j)
                
               DhBetaTotal(i,j,k) = (Dh_matriz(i,k) /2) * (1 + cos(inclinaciones (j)));
               
            end
        end
    end
    
    
end

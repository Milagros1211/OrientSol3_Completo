function BhBetaTotal = BhBeta (Val_decli, numeroN2, LAT_RAD, matriz_angulos2, Bh_matriz)

    %Creamos una matriz con las inclinaciones posibles, de 0º a 90º con
    %incremento de 1º

    inclinaciones = zeros(1,91);
    n = 0;
    if LAT_RAD <0
        for m=1:91
        
        n = n + ((-1*2*pi)/360);
        inclinaciones(m)= n;
        end
    else 
    for m=1:91
        
        n = n + ((1*2*pi)/360);
        inclinaciones(m)= n;
    end
    end
    
    %En la matriz "BhBetaTotal" se almacenan los valores horarios de la
    %radiación directa para las distintas inclinaciones
    
    %BhBetaTotal = zeros(91,12,numeroN2(j,i))
    
    for i=1:12
        for j=1:91
            for k=1:numeroN2(i,j)

                Cos_AngInciden = sin(Val_decli(i))* sin(LAT_RAD-inclinaciones(j))+ cos(Val_decli(i))* cos(LAT_RAD-inclinaciones(j))* cos(matriz_angulos2(i,j,k));
                
                Cos_AngZenital = sin(Val_decli(i))* sin(LAT_RAD) + cos(Val_decli(i))* cos(LAT_RAD)* cos(matriz_angulos2(i,j,k));
                
                BhBetaTotal(i,j,k)= (Bh_matriz(i,k) * Cos_AngInciden)/Cos_AngZenital;
                
                
            end
        end
    end
end

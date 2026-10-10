function GdBetaTotal = GdBeta(numeroN2,GhBetaTotal)

%En esta función se almacenan en la matriz "GdBetaTotal" las radiaciones Gdm para todas las inclinaciones posibles: (1º a 90º)    

    GdBetaTotal = zeros(12,91);

    for i=1:12
        for j=1:91
            suma = 0;
        
            for k=1:numeroN2(i,j)
                
                suma = suma + GhBetaTotal(i,j,k);
            
            end
        
            GdBetaTotal(i,j) = suma;
        
        end
    end
    
    
end

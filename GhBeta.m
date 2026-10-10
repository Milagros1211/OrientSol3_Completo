function GhBetaTotal = GhBeta(numeroN2,BhBetaTotal,DhBetaTotal,RhBetaTotal)

%En la matriz "GhBetaTotal" se almacenan los valores horarios de la
%radiación global para las distintas inclinaciones

    for i=1:12
        for j=1:91
            for k=1:numeroN2(i,j)
                
               GhBetaTotal(i,j,k) = (BhBetaTotal(i,j,k) + DhBetaTotal(i,j,k) + RhBetaTotal(i,j,k))*2;
               
            end
        end
    end
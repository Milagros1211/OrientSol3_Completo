function Bh_matriz = Bh0 (Gh_matriz, Dh_matriz, numeroN)
 
%En la matriz "Bh_matriz" se almacenan los valores horarios de la radiación
%directa sobre superficie horizontal

    for i=1:12
        for j=1:numeroN(i)
            
            Bh_matriz(i,j) = Gh_matriz(i,j)- Dh_matriz(i,j);
            
        end
    end

end
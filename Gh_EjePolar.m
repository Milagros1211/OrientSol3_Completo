function GhEjePolar = Gh_EjePolar (BhEjePolar, DhEjePolar, RhEjePolar, numeroN)

%En "GhEjePolar" se almacenan los valores horarios de la radiación global
%para el seguimiento a un eje Polar (a=  b= ) ... cos(AngIncidencia) = cos(Val_decli)  

%En este caso ya se multiplica por 2.

lim = max (numeroN);

GhEjePolar = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)
            
            GhEjePolar(i,j) = (BhEjePolar(i,j) + DhEjePolar(i,j) + RhEjePolar(i,j))*2;
            
        end
    end


end
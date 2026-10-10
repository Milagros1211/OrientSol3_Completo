function GhEjeAzimutal = Gh_EjeAzimutal (BhEjeAzimutal, DhEjeAzimutal, RhEjeAzimutal, numeroN)

%En "GhEjeAzimutal" se almacenan los valores horarios de la radiación global
%para el seguimiento a un eje azimutal(a=AzimutSolar b=Latitud del lugar)

%En este caso ya se multiplica por 2.

lim = max (numeroN);

GhEjeAzimutal = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)
            
            GhEjeAzimutal(i,j) = (BhEjeAzimutal(i,j) + DhEjeAzimutal(i,j) + RhEjeAzimutal(i,j))*2;
            
        end
    end


end
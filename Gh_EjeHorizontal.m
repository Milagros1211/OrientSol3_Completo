function GhEjeHorizontal = Gh_EjeHorizontal (BhEjeHorizontal, DhEjeHorizontal, RhEjeHorizontal, numeroN)

%En "GhEjeHorizontal" se almacenan los valores horarios de la radiación global
%para el seguimiento a un eje horizontal (a(alfa)=90º = pi/2 ; b(beta) =arctg(sen(AzimutSolar) /tg(AlturaSolar) 

%En este caso se multiplica por 2.

lim = max (numeroN);

GhEjeHorizontal = zeros(12,lim);
    for i=1:12
        for j=1:numeroN(i)
            
            GhEjeHorizontal(i,j) = (BhEjeHorizontal(i,j) + DhEjeHorizontal(i,j) + RhEjeHorizontal(i,j))*2;
            
        end
    end


end
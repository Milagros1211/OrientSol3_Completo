function DhEjeHorizontal = Dh_EjeHorizontal(Dh_matriz, numeroN, AzimutSolar, AlturaSolar)
 
%En "DhEjeHorizontal" se almacenan los valores horarios de la radiación difusa
%para el seguimiento a un eje horizontal (a= 90º b=arctg(sen(AzimutSolar)/tg(AlturaSolar)))    
lim = max(numeroN);

DhEjeHorizontal = zeros(12,lim);

    for i=1:12
        for j=1:numeroN(i)
            
            DhEjeHorizontal(i,j) = (Dh_matriz(i,j)/2)*(1 + cos(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j)))));
            
        end
    end



end
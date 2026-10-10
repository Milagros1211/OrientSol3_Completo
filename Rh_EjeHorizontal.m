function RhEjeHorizontal = Rh_EjeHorizontal(AzimutSolar, AlturaSolar, Gh_matriz, numeroN, COEF)

%En "RhEjeHorizontal" se almacenan los valores horarios de la radiación reflejada
%para el seguimiento a un eje horizontal (a=90º b=arctg(sen(AzimutSolar)/tg(AlturaSolar)))   

lim = max(numeroN);
RhEjeHorizontal = zeros(12,lim);

r = COEF;

    for i=1:12
        for j=1:numeroN(i)
            
            RhEjeHorizontal(i,j) = (Gh_matriz(i,j)/2)*(1 - cos(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j)))))* r;
            
        end
    end



end
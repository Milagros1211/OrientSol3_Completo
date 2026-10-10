function BhEjeHorizontal = Bh_EjeHorizontal(LAT_RAD, AzimutSolar, Val_decli, matriz_angulos, Bh_matriz, numeroN, AlturaSolar)
 
%En "BhEjeHorizontal" se almacenan los valores horarios de la radiación directa
%para el seguimiento a un eje horizontal (a(alfa)=90º = pi/2 ; b(beta) = arctg(sen(AzimutSolar) /tg(AlturaSolar) 
lim = max (numeroN);

BhEjeHorizontal = zeros(12,lim);

alfa = 90*2*pi/360;

    for i=1:12
        for j=1:numeroN(i)
       
                Result1 = ((sin(LAT_RAD) * cos(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j))))) - (cos(LAT_RAD) * sin(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j)))) * cos(alfa))) * sin(Val_decli(i)); 
            
                Result2 =(((cos(LAT_RAD) * cos(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j)))))+ sin(LAT_RAD)* sin(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j))))* cos(alfa))) * cos(Val_decli(i))* cos(matriz_angulos(i,j)); 
            
                Result3 = cos(Val_decli(i))* sin(atan(sin(AzimutSolar(i,j))/tan(AlturaSolar(i,j))))*sin(alfa)*sin(matriz_angulos(i,j));
            
            
            CosAngIncid = Result1 + Result2 + Result3;
            
            CosAngZenit = (sin(Val_decli(i)) * sin(LAT_RAD)) + (cos(Val_decli(i)) * cos(LAT_RAD) * cos(matriz_angulos(i,j)));            
            
            BhEjeHorizontal(i,j)= (Bh_matriz(i,j)* CosAngIncid)/ CosAngZenit;
            
        end
    end


end



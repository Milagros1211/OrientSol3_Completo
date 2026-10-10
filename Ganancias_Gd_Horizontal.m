function [GanaG_Hor_0, GanaG_Hor_Anu, GanaG_Hor_Est, GanaG_Hor_Pol, GanaG_Hor_Azi, PorGanaG_Hor_0, PorGanaG_Hor_Anu, PorGanaG_Hor_Est, PorGanaG_Hor_Pol, PorGanaG_Hor_Azi] = Ganancias_Gd_Horizontal(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Hor_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto al plano horizontal. 
    %Ganancia EjeHorizontal_0 = Gdm (Seg. Eje Horizontal) / Gdm (0)
    
    GanaG_Hor_0 = zeros(1,12);
    
    for i=1:12
    
        GanaG_Hor_0(i)= GdEjeHorizontal(i) / DATOS(i+2);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Hor_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_0 (%) = ((Gdm (Seg. Eje Horizontal) / Gdm (0))-1)*100
    
    PorGanaG_Hor_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Hor_0(j)= (GanaG_Hor_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Hor_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima anual. 
    %Ganancia EjeHorizontal_Anu = Gdm (Seg. Eje Horizontal) / Gdm (Inc Opt Anual)
    
    GanaG_Hor_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaG_Hor_Anu(i)= GdEjeHorizontal(i) / Radiacion_optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Hor_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Anu (%) = ((Gdm (Seg. Eje Horizontal) / Gdm (Inc Opt Anual))-1)*100
    
    PorGanaG_Hor_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Hor_Anu(j)= (GanaG_Hor_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las GdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

RadiacionG_optima_Est = zeros(1,12);

RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre

%COCIENTE__________________________________________________________________
    %En "GanaG_Hor_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a la inclinación óptima estacional. 
    %Ganancia EjeHorizontal_Est = Gdm (Seg. Eje Horizontal) / Gdm (Inc Opt Estacional)
    
    GanaG_Hor_Est = zeros(1,12);
    
    for i=1:12
    
        GanaG_Hor_Est(i)= GdEjeHorizontal(i) / RadiacionG_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Hor_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Est (%) = ((Gdm (Seg. Eje Horizontal) / Gdm (Inc Opt Estacional))-1)*100
    
    PorGanaG_Hor_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Hor_Est(j)= (GanaG_Hor_Est(j)-1)*100;
    
    end    
    

%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Hor_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje polar 
    %Ganancia EjeHorizontal_Pol = Gdm (Seg. Eje Horizontal) / Gdm (Seg. Eje Polar)
    
    GanaG_Hor_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaG_Hor_Pol(i)= GdEjeHorizontal(i) / GdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Hor_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Pol (%) = ((Gdm (Seg. Eje Horizontal) / Gdm (Seg. Eje Polar))-1)*100
    
    PorGanaG_Hor_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Hor_Pol(j)= (GanaG_Hor_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Hor_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje horizontal respecto a un seguimiento a un eje azimutal
    %Ganancia EjeHorizontal_Azi = Gdm (Seg. Eje Horizontal) / Gdm (Seg. Eje Azimutal)
    
    GanaG_Hor_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaG_Hor_Azi(i)= GdEjeHorizontal(i) / GdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Hor_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeHorizontal_Azi (%) = ((Gdm (Seg. Eje Horizontal) / Gdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaG_Hor_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Hor_Azi(j)= (GanaG_Hor_Azi(j)-1)*100;
    
    end


end


function [GanaG_Azi_0, GanaG_Azi_Anu, GanaG_Azi_Est, GanaG_Azi_Pol, GanaG_Azi_Hor, PorGanaG_Azi_0, PorGanaG_Azi_Anu, PorGanaG_Azi_Est, PorGanaG_Azi_Pol, PorGanaG_Azi_Hor] = Ganancias_Gd_Azimutal(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Azi_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto al plano horizontal. 
    %Ganancia EjeAzimutal_0 = Gdm (Seg. Eje Azimutal) / Gdm (0)
    
    GanaG_Azi_0 = zeros(1,12);
    
    for i=1:12
    
        GanaG_Azi_0(i)= GdEjeAzimutal(i) / DATOS(i+2);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Azi_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_0 (%) = ((Gdm (Seg. Eje Azimutal) / Gdm (0))-1)*100
    
    PorGanaG_Azi_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Azi_0(j)= (GanaG_Azi_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Azi_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima anual. 
    %Ganancia EjeAzimutal_Anu = Gdm (Seg. Eje Azimutal) / Gdm (Inc Opt Anual)
    
    GanaG_Azi_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaG_Azi_Anu(i)= GdEjeAzimutal(i) / Radiacion_optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Azi_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Anu (%) = ((Gdm (Seg. Eje Azimutal) / Gdm (Inc Opt Anual))-1)*100
    
    PorGanaG_Azi_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Azi_Anu(j)= (GanaG_Azi_Anu(j)-1)*100;
    
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
    %En "GanaG_Azi_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima estacional. 
    %Ganancia EjeAzimutal_Est = Gdm (Seg. Eje Azimutal) / Gdm (Inc Opt Estacional)
    
    GanaG_Azi_Est = zeros(1,12);
    
    for i=1:12
    
        GanaG_Azi_Est(i)= GdEjeAzimutal(i) / RadiacionG_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Azi_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Est (%) = ((Gdm (Seg. Eje Azimutal) / Gdm (Inc Opt Estacional))-1)*100
    
    PorGanaG_Azi_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Azi_Est(j)= (GanaG_Azi_Est(j)-1)*100;
    
    end    
    

%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Azi_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje polar 
    %Ganancia EjeAzimutal_Pol = Gdm (Seg. Eje Azimutal) / Gdm (Seg. Eje Polar)
    
    GanaG_Azi_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaG_Azi_Pol(i)= GdEjeAzimutal(i) / GdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Azi_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Pol (%) = ((Gdm (Seg. Eje Azimutal) / Gdm (Seg. Eje Polar))-1)*100
    
    PorGanaG_Azi_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Azi_Pol(j)= (GanaG_Azi_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Azi_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje horizontal 
    %Ganancia EjeAzimutal_Hor = Gdm (Seg. Eje Azimutal) / Gdm (Seg. Eje Horizontal)
    
    GanaG_Azi_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaG_Azi_Hor(i)= GdEjeAzimutal(i) / GdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Azi_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Hor (%) = ((Gdm (Seg. Eje Azimutal) / Gdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaG_Azi_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Azi_Hor(j)= (GanaG_Azi_Hor(j)-1)*100;
    
    end
end


function [GanaG_Pol_0, GanaG_Pol_Anu, GanaG_Pol_Est, GanaG_Pol_Azi, GanaG_Pol_Hor, PorGanaG_Pol_0, PorGanaG_Pol_Anu, PorGanaG_Pol_Est, PorGanaG_Pol_Azi, PorGanaG_Pol_Hor] = Ganancias_Gd_Polar(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Pol_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto al plano horizontal. 
    %Ganancia EjePolar_0 = Gdm (Seg. Eje Polar) / Gdm (0)
    
    GanaG_Pol_0 = zeros(1,12);
    
    for i=1:12
    
        GanaG_Pol_0(i)= GdEjePolar(i) / DATOS(i+2);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Pol_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_0 (%) = ((Gdm (Seg. Eje Polar) / Gdm (0))-1)*100
    
    PorGanaG_Pol_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Pol_0(j)= (GanaG_Pol_0(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Pol_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima anual. 
    %Ganancia EjePolar_Anu = Gdm (Seg. Eje Polar) / Gdm (Inc Opt Anual)
    
    GanaG_Pol_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaG_Pol_Anu(i)= GdEjePolar(i) / Radiacion_optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Anu (%) = ((Gdm (Seg. Eje Polar) / Gdm (Inc Opt Anual))-1)*100
    
    PorGanaG_Pol_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Pol_Anu(j)= (GanaG_Pol_Anu(j)-1)*100;
    
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
    %En "GanaG_Pol_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a la inclinación óptima estacional. 
    %Ganancia EjePolar_Est = Gdm (Seg. Eje Polar) / Gdm (Inc Opt Estacional)
    
    GanaG_Pol_Est = zeros(1,12);
    
    for i=1:12
    
        GanaG_Pol_Est(i)= GdEjePolar(i) / RadiacionG_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Pol_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Est (%) = ((Gdm (Seg. Eje Polar) / Gdm (Inc Opt Estacional))-1)*100
    
    PorGanaG_Pol_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Pol_Est(j)= (GanaG_Pol_Est(j)-1)*100;
    
    end    
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Pol_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje azimutal 
    %Ganancia EjePolar_Azi = Gdm (Seg. Eje Polar) / Gdm (Seg. Eje Azimutal)
    
    GanaG_Pol_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaG_Pol_Azi(i)= GdEjePolar(i) / GdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Pol_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Azi (%) = ((Gdm (Seg. Eje Polar) / Gdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaG_Pol_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Pol_Azi(j)= (GanaG_Pol_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Pol_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje polar respecto a un seguimiento a un eje horizontal 
    %Ganancia EjePolar_Hor = Gdm (Seg. Eje Polar) / Gdm (Seg. Eje Horizontal)
    
    GanaG_Pol_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaG_Pol_Hor(i)= GdEjePolar(i) / GdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Pol_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjePolar_Hor (%) = ((Gdm (Seg. Eje Polar) / Gdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaG_Pol_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Pol_Hor(j)= (GanaG_Pol_Hor(j)-1)*100;
    
    end

end


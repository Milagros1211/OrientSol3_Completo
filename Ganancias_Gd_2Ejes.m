function [GanaG_2Ej_0, GanaG_2Ej_Anu, GanaG_2Ej_Est, GanaG_2Ej_Pol, GanaG_2Ej_Azi, GanaG_2Ej_Hor, PorGanaG_2Ej_0, PorGanaG_2Ej_Anu, PorGanaG_2Ej_Est, PorGanaG_2Ej_Pol, PorGanaG_2Ej_Azi, PorGanaG_2Ej_Hor] = Ganancias_Gd_2Ejes(DATOS, Radiacion_optima, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, GdEjePolar, GdEjeAzimutal, GdEjeHorizontal, Gd2Ejes)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_2Ej_0" se almacenan las ganancias de radiación para un
    %seguimiento a dos ejes respecto al plano horizontal. 
    %Ganancia 2Ejes_0 = Gdm (Seg. 2 Ejes) / Gdm (0)
    
    GanaG_2Ej_0 = zeros(1,12);
    
    for i=1:12
    
        GanaG_2Ej_0(i)= Gd2Ejes(i) / DATOS(i+2);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_2Ej_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_0 (%) = ((Gdm (Seg. 2 Ejes) / Gdm (0))-1)*100
    
    PorGanaG_2Ej_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_2Ej_0(j)= (GanaG_2Ej_0(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_2Ej_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima anual. 
    %Ganancia 2Ejes_Anu  = Gdm (Seg. 2 Ejes) / Gdm (Inc Opt Anual)
    
    GanaG_2Ej_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaG_2Ej_Anu(i)= Gd2Ejes(i) / Radiacion_optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Anu(%) = ((Gdm (Seg. 2 Ejes) / Gdm (Inc Opt Anual))-1)*100
    
    PorGanaG_2Ej_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_2Ej_Anu(j)= (GanaG_2Ej_Anu(j)-1)*100;
    
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
    %En "GanaG_2Ej_Est" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima estacional. 
    %Ganancia 2Ejes_Est = Gdm (Seg. 2 Ejes) / Gdm (Inc Opt Estacional)
    
    GanaG_2Ej_Est = zeros(1,12);
    
    for i=1:12
    
        GanaG_2Ej_Est(i)= Gd2Ejes(i) / RadiacionG_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_2Ej_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Est (%) = ((Gdm (Seg. 2 Ejes) / Gdm (Inc Opt Estacional))-1)*100
    
    PorGanaG_2Ej_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_2Ej_Est(j)= (GanaG_2Ej_Est(j)-1)*100;
    
    end    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_2Ej_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje polar
    %Ganancia 2Ejes_Pol = Gdm (Seg. 2 Ejes) / Gdm (Seg. Eje Polar)
    
    GanaG_2Ej_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaG_2Ej_Pol(i)= Gd2Ejes(i) / GdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_2Ej_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Pol (%) = ((Gdm (Seg. 2 Ejes) / Gdm (Seg. Eje Polar))-1)*100
    
    PorGanaG_2Ej_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_2Ej_Pol(j)= (GanaG_2Ej_Pol(j)-1)*100;
    
    end
    
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_2Ej_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje azimutal 
    %Ganancia 2Ejes_Azi = Gdm (Seg. 2 Ejes) / Gdm (Seg. Eje Azimutal)
    
    GanaG_2Ej_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaG_2Ej_Azi(i)= Gd2Ejes(i) / GdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_2Ej_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Azi(%) = ((Gdm (Seg. 2 Ejes) / Gdm (Seg. Eje Azimutal))-1)*100
    
    PorGanaG_2Ej_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_2Ej_Azi(j)= (GanaG_2Ej_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_2Ej_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje horizontal 
    %Ganancia 2Ejes_Hor = Gdm (Seg. 2 Ejes) / Gdm (Seg. Eje Horizontal)
    
    GanaG_2Ej_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaG_2Ej_Hor(i)= Gd2Ejes(i) / GdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_2Ej_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Hor (%) = ((Gdm (Seg. 2 Ejes) / Gdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaG_2Ej_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_2Ej_Hor(j)= (GanaG_2Ej_Hor(j)-1)*100;
    
    end
end


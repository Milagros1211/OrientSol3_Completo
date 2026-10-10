function [GanaD_2Ej_0, GanaD_2Ej_Anu, GanaD_2Ej_Est, GanaD_2Ej_Pol, GanaD_2Ej_Azi, GanaD_2Ej_Hor, PorGanaD_2Ej_0, PorGanaD_2Ej_Anu, PorGanaD_2Ej_Est, PorGanaD_2Ej_Pol, PorGanaD_2Ej_Azi, PorGanaD_2Ej_Hor] = Ganancias_Dd_2Ejes(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal, Dd2Ejes)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_2Ej_0" se almacenan las ganancias de radiación para un
    %seguimiento a dos ejes respecto al plano horizontal. 
    %Ganancia 2Ejes_0 = Ddm (Seg. 2 Ejes) / Ddm (0)
    
    GanaD_2Ej_0 = zeros(1,12);
    
    for i=1:12
    
        GanaD_2Ej_0(i)= Dd2Ejes(i) / Val_Ddm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_2Ej_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_0 (%) = ((Ddm (Seg. 2 Ejes) / Ddm (0))-1)*100
    
    PorGanaD_2Ej_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_2Ej_0(j)= (GanaD_2Ej_0(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_2Ej_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima anual. 
    %Ganancia 2Ejes_Anu  = Ddm (Seg. 2 Ejes) / Ddm (Inc Opt Anual)
    
    GanaD_2Ej_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaD_2Ej_Anu(i)= Dd2Ejes(i) / Radiacion_Dd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Pol_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Anu(%) = ((Ddm (Seg. 2 Ejes) / Ddm (Inc Opt Anual))-1)*100
    
    PorGanaD_2Ej_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_2Ej_Anu(j)= (GanaD_2Ej_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las DdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

RadiacionD_optima_Est = zeros(1,12);

RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febero

RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo

RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre

%COCIENTE__________________________________________________________________
    %En "GanaD_2Ej_Est" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a la inclinación óptima estacional. 
    %Ganancia 2Ejes_Est = Ddm (Seg. 2 Ejes) / Ddm (Inc Opt Estacional)
    
    GanaD_2Ej_Est = zeros(1,12);
    
    for i=1:12
    
        GanaD_2Ej_Est(i)= Dd2Ejes(i) / RadiacionD_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_2Ej_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Est (%) = ((Ddm (Seg. 2 Ejes) / Ddm (Inc Opt Estacional))-1)*100
    
    PorGanaD_2Ej_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_2Ej_Est(j)= (GanaD_2Ej_Est(j)-1)*100;
    
    end    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_2Ej_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje polar
    %Ganancia 2Ejes_Pol = Ddm (Seg. 2 Ejes) / Ddm (Seg. Eje Polar)
    
    GanaD_2Ej_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaD_2Ej_Pol(i)= Dd2Ejes(i) / DdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_2Ej_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Pol (%) = ((Ddm (Seg. 2 Ejes) / Ddm (Seg. Eje Polar))-1)*100
    
    PorGanaD_2Ej_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_2Ej_Pol(j)= (GanaD_2Ej_Pol(j)-1)*100;
    
    end
    
    
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE AZIMUTAL:::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_2Ej_Azi" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje azimutal 
    %Ganancia 2Ejes_Azi = Ddm (Seg. 2 Ejes) / Ddm (Seg. Eje Azimutal)
    
    GanaD_2Ej_Azi = zeros(1,12);
    
    for i=1:12
    
        GanaD_2Ej_Azi(i)= Dd2Ejes(i) / DdEjeAzimutal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_2Ej_Azi" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Azi(%) = ((Ddm (Seg. 2 Ejes) / Ddm (Seg. Eje Azimutal))-1)*100
    
    PorGanaD_2Ej_Azi = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_2Ej_Azi(j)= (GanaD_2Ej_Azi(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_2Ej_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a 2 ejes respecto a un seguimiento a un eje horizontal 
    %Ganancia 2Ejes_Hor = Ddm (Seg. 2 Ejes) / Ddm (Seg. Eje Horizontal)
    
    GanaD_2Ej_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaD_2Ej_Hor(i)= Dd2Ejes(i) / DdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_2Ej_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia 2Ejes_Hor (%) = ((Ddm (Seg. 2 Ejes) / Ddm (Seg. Eje Horizontal))-1)*100
    
    PorGanaD_2Ej_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_2Ej_Hor(j)= (GanaD_2Ej_Hor(j)-1)*100;
    
    end


end


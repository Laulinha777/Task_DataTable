function removerAcentos(strAccents) {
    strAccents = strAccents.split(''); //vai transformar a string em um array de caracter
    let strAccents_Out = [];//armazena os caracterees modificcados
    let strAccents_Len = strAccents.length; // processa o tamnaho da array

    let acentos = 'ÁÀÃÂáàãâÍÌíìÉÈÊéèêÓÒÕÔóòõôÚÙÛúùûçÇ';
    let sem_acentos = 'AAAAaaaaIIiiEEEeeeOOOOooooUUUuuucC';

    for (let x = 0; x < strAccents_Len; x++) {
        let idx = acentos.indexOf(strAccents[x]);
        strAccents_Out[x] = idx !== -1 ? sem_acentos.charAt(idx) : strAccents[x];
    }

    return strAccents_Out.join('');
}

// Ordenação personalizada para portugues
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
   "portugues-pre": function (data) {
    if (!data) return '';
 
    let normalized = removerAcentos(data)
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, ' ')
                    .replace(/[^\w\s]/g, ''); // Remove símbolos ocultos
     
    return normalized;
},

    "portugues-asc": function (a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    },
    "portugues-desc": function (a, b) {
        return a < b ? 1 : a > b ? -1 : 0;
    }
});


function format(aluno) {
    return `
    <div>
        <strong>Modalidade de Estágio:</strong> ${aluno.modalidade_estagio.join(", ")}<br>
        <strong>Competências:</strong> ${aluno.competencias.join(", ")}<br>
        <strong>Já estagiou?:</strong> ${aluno.ja_estagiou.toLowerCase() === "true" ? "Sim" : "Não"}<br>
        <strong>Autoriza o uso de imagem?:</strong> Sim
    </div>
    `;
}

$(document).ready(function () {
    let ultimaLinhaSelecionada = null;

    const tabela = $('#alunos-tabela').DataTable({

        columnDefs: [
            { type: 'portugues', targets: [2, 4, 8] } // nome, curso, cidade
        ], 
        ajax: {
            url: 'http://localhost:3000/api/alunos',
            dataSrc: ''
        },
        
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: "+"
            },
            { data: 'id' },
            { data: 'nome' },
            { data: 'email' },
            { data: 'curso' },
            { data: 'ano_graduacao' },
            { data: 'cpf' },
            { data: 'telefone' },
            { data: 'cidade' },
            { data: 'pais' },
            { data: 'etnia' }
        ],
        ordering: true
    });

    $('#alunos-tabela tbody').on('click', 'tr', function (evento) {
        if ($(evento.target).hasClass('details-control')) return;

        const index = tabela.row(this).index();

        if (evento.shiftKey && ultimaLinhaSelecionada !== null) {
            const start = Math.min(ultimaLinhaSelecionada, index);
            const end = Math.max(ultimaLinhaSelecionada, index);

            for (let i = start; i <= end; i++) {
                const node = tabela.row(i).node();
                $(node).addClass('selected');
            }
        } else {
            $(this).toggleClass('selected');
            ultimaLinhaSelecionada = index;
        }
    });

    $('#alunos-tabela tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = tabela.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
            $(this).text('+');
        } else {
            row.child('<div>Carregando...</div>').show();
            tr.addClass('shown');
            $(this).text('-');

            const alunoId = row.data().id;

            $.ajax({
                url: `http://localhost:3000/api/aluno?id=${alunoId}`,
                method: 'GET',
                success: function (alunoDetalhes) {
                    row.child(format(alunoDetalhes)).show();
                },
                error: function () {
                    row.child('<div>Erro ao carregar detalhes.</div>').show();
                }
            });
        }
    });
});
